const express = require('express');
const client = require('prom-client');

const app = express();
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

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;
