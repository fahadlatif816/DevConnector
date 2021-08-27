const usersRoutes = require('./../routes/api/users');
const profileRoutes = require('./../routes/api/profile');
const postsRoutes = require('./../routes/api/posts');
const authRoutes = require('./../routes/api/auth');
const RESPONSE_STATUS = require('./../common/status');

const errorBoundary = (err, req, res, next) => {
  console.error(err);
  res.status(RESPONSE_STATUS.INTERNAL_SERVER_ERROR).send(err);
};

module.exports = (app) => {
  app.use('/api/users', usersRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/posts', postsRoutes);
  app.use('/api/auth', authRoutes);

  // This is an error boundary for any un-catch errors, must be placed at the end of all the middlewares
  app.use(errorBoundary);
};
