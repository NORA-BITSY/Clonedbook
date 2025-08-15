const express = require('express');
const Stripe = require('stripe');
const { z } = require('zod');
const { problemHandler, makeProblem } = require('../../utils/problemDetails');

const app = express();
const port = 3008; // Assuming a port for payment service

// Require STRIPE_SECRET_KEY or fail fast
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('STRIPE_SECRET_KEY is not set. Exiting.');
  process.exit(1);
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Middleware to parse raw body for webhook signature verification
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // TODO: Update your database record here
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

app.use(express.json()); // For other routes

const createPaymentIntentSchema = z.object({
  amount: z.number().int().positive(), // in cents
  currency: z.enum(['usd', 'eur']), // currency allow-list
  paymentMethodId: z.string().min(1),
});

app.post('/api/payment/create-payment-intent', async (req, res, next) => {
  try {
    const { amount, currency, paymentMethodId } = createPaymentIntentSchema.parse(req.body);
    const idempotencyKey = req.headers['idempotency-key'];

    if (!idempotencyKey) {
      throw makeProblem(400, 'Bad Request', 'Idempotency-Key header is required.', 'https://boatable.app/problems/missing-idempotency-key');
    }

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        payment_method: paymentMethodId,
        confirm: true,
        off_session: true,
      },
      {
        idempotencyKey,
      }
    );

    // Normalize token response shape (assuming paymentIntent.client_secret is the "token")
    res.json({ token: paymentIntent.client_secret });
  } catch (error) {
    if (error.type === 'StripeCardError') {
      next(makeProblem(400, 'Payment Failed', error.message, 'https://boatable.app/problems/stripe-card-error'));
    } else if (error.type === 'StripeInvalidRequestError') {
      next(makeProblem(400, 'Invalid Stripe Request', error.message, 'https://boatable.app/problems/stripe-invalid-request'));
    } else {
      next(error);
    }
  }
});

app.use(problemHandler);

app.listen(port, () => {
  console.log(`Payment service listening on port ${port}`);
});
