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
  const deleteEducation = (id) => {
    return axios.delete(`/api/profile/education/${id}`, {}, config);
  };
  const deleteExperience = (id) => {
    return axios.delete(`/api/profile/experience/${id}`, {}, config);
  };
  const deleteAccount = () => {
    return axios.delete('/api/profile', {}, config);
  };
  const getProfiles = () => {
    return axios.get('/api/profile', {}, config);
  };
  const getProfileByUserId = (userId) => {
    return axios.get(`/api/profile/user/${userId}`, {}, config);
  };
  const getGithubRepos = (username) => {
    return axios.get(`/api/profile/github/${username}`, {}, config);
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
    deleteAccount,
    deleteEducation,
    deleteExperience,
    getProfiles,
    getProfileByUserId,
    getGithubRepos,
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
