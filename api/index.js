const express = require('express');

// Import the already-built Express app (middlewares + routes)
const app = require('../src/app');

// Vercel expects a request handler/export.
// We proxy the request/response through the Express app.
module.exports = (req, res) => {
  // Ensure the app is the express instance
  if (!app || typeof app !== 'function') {
    return res.status(500).send('Express app not initialized');
  }
  return app(req, res);
};

