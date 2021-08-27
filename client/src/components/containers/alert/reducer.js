import { SET_ALERT, REMOVE_ALERT } from './constants';
import initialState from './initialState';

export default function alertReducer(state = initialState, action) {
  switch (action.type) {
    case SET_ALERT:
      return [...state, action.payload];
    case REMOVE_ALERT:
      return state.filter((elem) => elem.id !== action.payload);
    default:
      return state;
  }
}
