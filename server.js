const express = require('express');
const connectDB = require('./config/db');
const setupMiddlewares = require('./setup/middlewares');
const setupRoutes = require('./setup/routes');
const RESPONSE_STATUS = require('./common/status');

const app = express();

// Connect Database
connectDB();

// Setup Middlewares
setupMiddlewares(app);

app.get('/', (req, res) => {
  res.send('Recieved a Get Request');
});

// Define routes
setupRoutes(app);

app.all('*', (req, res) => {
  res
    .status(RESPONSE_STATUS.NOT_FOUND)
    .send(
      `404!! Can not found route: ${req.originalUrl} for method: ${req.method}`
    );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
