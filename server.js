const app = require('./app');
const pool = require('./db');

async function start() {
  if (pool) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        pizza TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      )
    `);
  }

  const server = app.listen(3000, () => console.log('PizzaCloud sur le port 3000'));

  const shutdown = async (signal) => {
    console.log(`${signal} reçu, arrêt propre...`);
    server.close();
    if (pool) await pool.end();
    process.exit(0);
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
