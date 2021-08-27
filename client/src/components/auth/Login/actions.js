import { LOGIN_USER, LOGIN_SUCCESS, LOGIN_FAIL } from './constant';
import { setAlert } from './../../containers/alert/actions';
import { authUser } from './../authUser/action';
import API from './../../../services/api';

const api = API.create();

export const loginUser =
  (params = {}) =>
  async (dispatch) => {
    dispatch({
      type: LOGIN_USER,
    });
    try {
      const response = await api.loginUser(params);
      console.log(response);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: response.data,
      });
      dispatch(authUser());
    } catch (error) {
      console.log(error.response.data.errors);
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((elem) => {
          dispatch(setAlert({ msg: elem.msg, alertType: 'danger' }));
        });
      }
      dispatch({ type: LOGIN_FAIL });
    }
  };
