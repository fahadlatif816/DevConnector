import { REGISTER_USER, REGISTER_SUCCESS, REGISTER_FAIL } from './constants';
import API from './../../../services/api';
import { setAlert } from './../../containers/alert/actions';
import { authUser } from './../authUser/action';

const api = API.create();

export const registerUser =
  (params = {}) =>
  async (dispatch) => {
    dispatch({
      type: REGISTER_USER,
    });
    try {
      const response = await api.registerUser(params);
      console.log('response', response);
      dispatch({
        type: REGISTER_SUCCESS,
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
      dispatch({ type: REGISTER_FAIL });
    }
  };
