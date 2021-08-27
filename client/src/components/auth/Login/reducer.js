import initialState from './initialState';
import { LOGIN_USER, LOGIN_SUCCESS, LOGIN_FAIL } from './constant';

export default function loginReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        success: false,
        loading: false,
      };

    default:
      return state;
  }
}
