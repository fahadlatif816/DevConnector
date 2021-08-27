import initialState from './initialState';
import {
  FETCH_PROFILE,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
  CREATE_PROFILE,
  CREATE_PROFILE_SUCCESS,
  CREATE_PROFILE_FAIL,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
} from './constants';

export default function dashboardReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PROFILE:
    case CREATE_PROFILE:
    case UPDATE_PROFILE:
      return { ...state, loading: true };
    case FETCH_PROFILE_SUCCESS:
    case CREATE_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, loading: false, profile: action.payload };
    case FETCH_PROFILE_FAIL:
    case CREATE_PROFILE_FAIL:
    case UPDATE_PROFILE_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_PROFILE:
      return { ...state, profile: null, repos: [], loading: false };
    default:
      return state;
  }
}
