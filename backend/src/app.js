const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');

// Initialize express app
const app = express();

// CORS configuration: allow Angular frontend origin via env, fallback to common dev origins
const FRONTEND_URL =
  process.env.NG_APP_FRONTEND_URL ||
  process.env.FRONTEND_URL || // optional alternative
  'http://localhost:3000';

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser tools (no origin) and the configured frontend
      if (!origin) return callback(null, true);
      const allowed = [FRONTEND_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'];
      if (allowed.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Trust proxy for correct proto/host (needed for accurate Swagger server URL)
app.set('trust proxy', process.env.NG_APP_TRUST_PROXY === 'true' || true);

// Serve OpenAPI JSON at /openapi.json using the generated swagger spec
app.get('/openapi.json', (req, res) => {
  // Add dynamic servers block based on current request
  const host = req.get('host');
  let protocol = req.secure ? 'https' : req.protocol;
  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');
  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) || (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [{ url: `${protocol}://${fullHost}` }],
  };
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(dynamicSpec, null, 2));
});

// Serve Swagger UI at /docs pointing to our /openapi.json (ensures correct base path/proto)
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerUrl: '/openapi.json',
    explorer: true,
  })
);

// Parse JSON request body
app.use(express.json());

// Mount routes (includes health GET /)
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;
