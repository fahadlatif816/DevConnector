import {
  FETCH_PROFILE,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
  CREATE_PROFILE,
  CREATE_PROFILE_SUCCESS,
  CREATE_PROFILE_FAIL,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
} from './constants';
import API from './../../services/api';
import { setAlert } from '../containers/alert/actions';

const api = API.create();

export const getCurrentUserProfile = () => async (dispatch) => {
  dispatch({
    type: FETCH_PROFILE,
  });

  try {
    const response = await api.getCurrentUserProfile();
    console.log(response);
    dispatch({
      type: FETCH_PROFILE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.log(error.response);
    dispatch({
      type: FETCH_PROFILE_FAIL,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

export const createProfile =
  (params = {}, history, isEdit = false) =>
  async (dispatch) => {
    dispatch({
      type: CREATE_PROFILE,
    });

    try {
      const response = await api.createProfile(params);
      console.log(response);
      dispatch({
        type: CREATE_PROFILE_SUCCESS,
        payload: response.data,
      });
      dispatch(
        setAlert({
          msg: isEdit ? 'Profile Updated' : 'Profile Created',
          alertType: 'success',
        })
      );
      if (!isEdit) history.push('/dashboard');
    } catch (err) {
      console.log(err.response);
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          console.log(error);
          dispatch(setAlert({ msg: error.msg, alertType: 'danger' }));
        });
      }
      dispatch({
        type: CREATE_PROFILE_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Add Experience
export const addExperience =
  (params = {}, history) =>
  async (dispatch) => {
    dispatch({
      type: UPDATE_PROFILE,
    });

    try {
      const response = await api.addExperience(params);
      console.log(response);
      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: response.data,
      });
      dispatch(
        setAlert({
          msg: 'Experience Added',
          alertType: 'success',
        })
      );
      history.push('/dashboard');
    } catch (err) {
      console.log(err.response);
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          console.log(error);
          dispatch(setAlert({ msg: error.msg, alertType: 'danger' }));
        });
      }
      dispatch({
        type: UPDATE_PROFILE_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };

// Add Education
export const addEducation =
  (params = {}, history) =>
  async (dispatch) => {
    dispatch({
      type: UPDATE_PROFILE,
    });

    try {
      const response = await api.addEducation(params);
      console.log(response);
      dispatch({
        type: UPDATE_PROFILE_SUCCESS,
        payload: response.data,
      });
      dispatch(
        setAlert({
          msg: 'Education Added',
          alertType: 'success',
        })
      );
      history.push('/dashboard');
    } catch (err) {
      console.log(err.response);
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) => {
          console.log(error);
          dispatch(setAlert({ msg: error.msg, alertType: 'danger' }));
        });
      }
      dispatch({
        type: UPDATE_PROFILE_FAIL,
        payload: { msg: err.response.statusText, status: err.response.status },
      });
    }
  };
