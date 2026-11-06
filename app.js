const express = require('express');
const client = require('prom-client');
const pool = require('./db');

const app = express();
app.use(express.json());
client.collectDefaultMetrics();

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total des requêtes HTTP',
  labelNames: ['route', 'status'],
});

const pizzas = [
  { id: 1, name: 'Margherita', price: 8 },
  { id: 2, name: 'Reine', price: 10 },
];

app.get('/pizzas', (req, res) => {
  httpRequests.inc({ route: '/pizzas', status: 200 });
  res.json(pizzas);
});

app.post('/orders', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'base de données non configurée' });
  const { pizza } = req.body || {};
  if (!pizza) return res.status(400).json({ error: 'champ "pizza" requis' });
  const result = await pool.query(
    'INSERT INTO orders (pizza) VALUES ($1) RETURNING *',
    [pizza]
  );
  res.status(201).json(result.rows[0]);
});

app.get('/orders', async (req, res) => {
  if (!pool) return res.status(503).json({ error: 'base de données non configurée' });
  const result = await pool.query('SELECT * FROM orders ORDER BY id');
  res.json(result.rows);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;
