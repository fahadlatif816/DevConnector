const config = require('config');
const jwt = require('jsonwebtoken');
const { getCookies, verifyJwt } = require('../helper/authHelper');
const RESPONSE_STATUS = require('./../common/status');

module.exports = function (req, res, next) {
  // Get token from cookies
  const token = getCookies(req, config.get('cookieToken'))[
    config.get('cookieToken')
  ];

  // Check if no token found
  if (!token) {
    return res
      .status(RESPONSE_STATUS.NOT_AUTHENTICATED)
      .json({ msg: 'No token, authorization denied.' });
  }

  try {
    // Decode token
    const decoded = verifyJwt(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err);
    res.status(404).json({ msg: 'Unable to verify token...' });
  }
};
