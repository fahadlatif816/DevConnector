import {
  USER_AUTH,
  USER_AUTH_SUCCESS,
  USER_AUTH_FAIL,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
} from './constants';
import { CLEAR_PROFILE } from './../../Dashboard/constants';
import API from './../../../services/api';
const api = API.create();

export const authUser = () => async (dispatch) => {
  dispatch({
    type: USER_AUTH,
  });
  try {
    const response = await api.getAuthenticatedUser();
    console.log(response);
    dispatch({
      type: USER_AUTH_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    console.log(error.response.data);
    dispatch({
      type: USER_AUTH_FAIL,
    });
  }
};

export const logoutUser = () => async (dispatch) => {
  dispatch({
    type: LOGOUT_USER,
  });

  try {
    const response = await api.logoutUser();
    console.log(response);
    dispatch({
      type: LOGOUT_USER_SUCCESS,
    });
    dispatch({
      type: CLEAR_PROFILE,
    });
  } catch (error) {
    console.log(error.response.data.errors);
    dispatch({ type: LOGOUT_USER_FAIL });
  }
};
