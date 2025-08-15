const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const { problemHandler, makeProblem } = require('../../utils/problemDetails');

const app = express();
const port = 3010; // Assuming a port for marketplace service

// Elasticsearch Client
const esClient = new Client({
  node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
  requestTimeout: 30000, // Set client request timeout
});

const INDEX_NAME = 'marketplace_listings';

// Function to create index with a template
async function createIndexWithTemplate() {
  try {
    const exists = await esClient.indices.exists({ index: INDEX_NAME });
    if (!exists.body) { // Treat indices.exists as boolean
      console.log(`Index ${INDEX_NAME} does not exist. Creating with template.`);
      await esClient.indices.create({
        index: INDEX_NAME,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
          },
          mappings: {
            properties: {
              title: { type: 'text' },
              description: { type: 'text' },
              price: { type: 'float' },
              createdAt: { type: 'date' },
            },
          },
        },
      });
      console.log(`Index ${INDEX_NAME} created.`);
    } else {
      console.log(`Index ${INDEX_NAME} already exists.`);
    }
  } catch (error) {
    console.error('Error creating index with template:', error);
  }
}

// Retry mechanism for indexing
async function indexWithRetry(document, id = undefined, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await esClient.index({
        index: INDEX_NAME,
        id: id,
        body: document,
        refresh: true, // Make the document immediately searchable
      });
      console.log(`Document indexed: ${response.body._id}`);
      return response;
    } catch (error) {
      console.error(`Indexing failed (attempt ${i + 1}/${retries}):`, error.message);
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      } else {
        throw error; // Re-throw if all retries fail
      }
    }
  }
}

app.use(express.json());

// Initialize index on startup
createIndexWithTemplate();

app.post('/api/marketplace/listings', async (req, res, next) => {
  try {
    const { title, description, price } = req.body; // Basic validation for example
    if (!title || !description || !price) {
      throw makeProblem(400, 'Bad Request', 'Title, description, and price are required.');
    }

    const document = {
      title,
      description,
      price,
      createdAt: new Date(),
    };

    const response = await indexWithRetry(document);
    res.status(201).json({ message: 'Listing created', id: response.body._id });
  } catch (error) {
    next(error);
  }
});

app.get('/api/marketplace/search', async (req, res, next) => {
  try {
    const { query } = req.query;
    const { body } = await esClient.search({
      index: INDEX_NAME,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['title', 'description'],
          },
        },
      },
    });
    res.json(body.hits.hits.map(hit => hit._source));
  } catch (error) {
    next(error);
  }
});

app.use(problemHandler);

app.listen(port, () => {
  console.log(`Marketplace service listening on port ${port}`);
});
