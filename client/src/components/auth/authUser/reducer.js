import initialState from './initialState';
import {
  USER_AUTH,
  USER_AUTH_SUCCESS,
  USER_AUTH_FAIL,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAIL,
} from './constants';

export default function authUserReducer(state = initialState, action) {
  switch (action.type) {
    case USER_AUTH:
      return {
        ...state,
        loading: true,
        isAuthenticated: false,
        user: null,
      };

    case USER_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };

    case USER_AUTH_FAIL:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
      };

    case LOGOUT_USER:
      return {
        ...state,
        loading: true,
      };

    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      };

    case LOGOUT_USER_FAIL:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
