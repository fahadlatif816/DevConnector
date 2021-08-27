import { REGISTER_USER, REGISTER_SUCCESS, REGISTER_FAIL } from './constants';
import initialState from './initialState';

export default function registerReducer(state = initialState, action) {
  switch (action.type) {
    case REGISTER_USER:
      return {
        ...state,
        loading: true,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        success: true,
        loading: false,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        success: false,
        loading: false,
      };
    default:
      return state;
  }
}
