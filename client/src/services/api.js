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
  const getCurrentUserProfile = () => {
    return axios.get('api/profile/me', {}, config);
  };
  const createProfile = (params = {}) => {
    return axios.post('/api/profile', params, config);
  };
  const addEducation = (params = {}) => {
    return axios.put('/api/profile/education', params, config);
  };
  const addExperience = (params = {}) => {
    return axios.put('/api/profile/experience', params, config);
  };

  return {
    registerUser,
    loginUser,
    getAuthenticatedUser,
    logoutUser,
    getCurrentUserProfile,
    createProfile,
    addExperience,
    addEducation,
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
