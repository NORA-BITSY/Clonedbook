const express = require('express');
const mqtt = require('mqtt');
const { z } = require('zod');
const { problemHandler, makeProblem } = require('../../utils/problemDetails');

const app = express();
const port = 3009; // Assuming a port for IoT service

// In-memory store for simplicity, simulating TimescaleDB
const sensorData = [];
const deviceRateLimits = new Map(); // Map<deviceId, { count: number, lastReset: number }>

// MQTT Client
const mqttClient = mqtt.connect('mqtt://localhost:1883'); // Assuming MQTT broker is running on default port

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('iot/+/data', (err) => {
    if (err) {
      console.error('Failed to subscribe to MQTT topic:', err);
    }
  });
});

mqttClient.on('message', (topic, message) => {
  try {
    const deviceId = topic.split('/')[1];
    const payload = JSON.parse(message.toString());

    // Zod schema for MQTT payloads
    const sensorPayloadSchema = z.object({
      sensorType: z.string().min(1),
      value: z.number(),
      timestamp: z.string().datetime(), // ISO 8601 format
    });

    const validatedPayload = sensorPayloadSchema.parse(payload);

    // Dedupe on (deviceId, sensorType, time)
    const existingEntry = sensorData.find(
      (data) =>
        data.deviceId === deviceId &&
        data.sensorType === validatedPayload.sensorType &&
        data.time === validatedPayload.timestamp
    );
    if (existingEntry) {
      console.warn(`Duplicate message received for ${deviceId}/${validatedPayload.sensorType} at ${validatedPayload.timestamp}. Skipping.`);
      return;
    }

    // Basic per-device rate limit (e.g., 50 msgs/10s)
    const now = Date.now();
    const rateLimit = deviceRateLimits.get(deviceId) || { count: 0, lastReset: now };
    if (now - rateLimit.lastReset > 10000) { // 10 seconds
      rateLimit.count = 0;
      rateLimit.lastReset = now;
    }
    if (rateLimit.count >= 50) {
      console.warn(`Rate limit exceeded for device ${deviceId}. Dropping message.`);
      return;
    }
    rateLimit.count++;
    deviceRateLimits.set(deviceId, rateLimit);

    // Clamp numeric ranges (example: value between 0 and 100)
    const clampedValue = Math.max(0, Math.min(100, validatedPayload.value));

    // Reject future timestamps with large skew (e.g., more than 5 minutes in future)
    const messageTime = new Date(validatedPayload.timestamp).getTime();
    if (messageTime > now + 5 * 60 * 1000) {
      console.warn(`Future timestamp detected for device ${deviceId}. Dropping message.`);
      return;
    }

    // Insert into sensor_data(time, device_id, sensor_type, value)
    sensorData.push({
      time: validatedPayload.timestamp,
      deviceId,
      sensorType: validatedPayload.sensorType,
      value: clampedValue,
    });
    console.log(`Received data for ${deviceId}: ${JSON.stringify(validatedPayload)}`);
  } catch (error) {
    console.error('Malformed MQTT message or processing error:', error);
    // Log to a dead-letter logger (for simplicity, just console.error)
  }
});

app.use(express.json());

app.get('/api/iot/data/:deviceId', (req, res) => {
  const { deviceId } = req.params;
  const data = sensorData.filter(d => d.deviceId === deviceId).sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  res.json(data);
});

app.use(problemHandler);

app.listen(port, () => {
  console.log(`IoT service listening on port ${port}`);
});
