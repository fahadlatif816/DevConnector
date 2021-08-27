const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const hpp = require('hpp');
const helmet = require('helmet');

const appendHeaders = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'PUT, PATCH, POST, GET, DELETE, OPTIONS'
  );
  res.header('Access-Control-Allow-Credentials', true);

  next();
};

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(hpp());
  // app.use(appendHeaders);
  // app.use(helmet());
  // app.use(compression());
  app.use(cookieParser());
  // app.use(
  //   rateLimit({
  //     windowMs: 15 * 60 * 1000,
  //     max: 100,
  //   })
  // );
};
