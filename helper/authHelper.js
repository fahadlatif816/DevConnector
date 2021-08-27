const jwt = require('jsonwebtoken');

const signJWT = (payload, secret, options = {}) => {
  return jwt.sign(payload, secret, options);
};

const verifyJwt = (token, secret) => {
  return jwt.verify(token, secret);
};

const setCookies = (res, val, options = {}) => {
  val.forEach((o) => {
    const { secret, value } = o;
    if (secret && value) {
      res.cookie(secret, value, options);
    } else {
      console.log('Unable to set cookie with data', val);
    }
  });
};

const getCookies = (res, key) => {
  const data = {};
  if (!key) return data;
  if (key instanceof Array) {
    key.forEach((element) => {
      data[element] = res.cookies[element];
    });
  } else {
    data[key] = res.cookies[key];
  }
  return data;
};

const resetCookies = (res, secrets) => {
  if (secrets instanceof Array) {
    secrets.forEach((secret) => {
      res.clearCookie(secret);
    });
  } else {
    res.clearCookie(secrets);
  }
};

module.exports = {
  signJWT,
  verifyJwt,
  setCookies,
  getCookies,
  resetCookies,
};
