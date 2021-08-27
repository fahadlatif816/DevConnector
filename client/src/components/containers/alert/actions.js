import { SET_ALERT, REMOVE_ALERT } from './constants';
import { v4 as uuid } from 'uuid';

export const setAlert = (data) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: SET_ALERT,
    payload: { ...data, id },
  });

  setTimeout(() => {
    dispatch({
      type: REMOVE_ALERT,
      payload: id,
    });
  }, 5000);
};
