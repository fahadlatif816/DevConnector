import axios from 'axios';

const createFactory = () => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const registerUser = (params = {}) => {
    return axios.post('/api/users', params, config);
  };
  const loginUser = (params = {}) => {
    return axios.post('/api/auth', params, config);
  };
  const getAuthenticatedUser = () => {
    return axios.get('/api/users', {}, config);
  };
  const logoutUser = () => {
    return axios.post('/api/auth/logout', {}, config);
  };

  return {
    registerUser,
    loginUser,
    getAuthenticatedUser,
    logoutUser,
  };
};

const singleton = (() => {
  let cacheFactory = null;

  return {
    create: () => {
      if (!cacheFactory) {
        cacheFactory = createFactory();
      }
      return cacheFactory;
    },
  };
})();

const API = {
  create: singleton.create,
};

export default API;
