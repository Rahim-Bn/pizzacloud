const request = require('supertest');
const app = require('./app');

test('GET /pizzas renvoie 2 pizzas', async () => {
  const res = await request(app).get('/pizzas');
  expect(res.status).toBe(200);
  expect(res.body).toHaveLength(2);
});

test('GET /health est ok', async () => {
  const res = await request(app).get('/health');
  expect(res.body.status).toBe('ok');
});
