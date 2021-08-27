import { combineReducers } from 'redux';
import alertReducer from '../components/containers/alert/reducer';
import registerReducer from '../components/auth/Register/reducer';
import loginReducer from '../components/auth/Login/reducer';
import authReducer from '../components/auth/authUser/reducer';
import dashboardReducer from '../components/Dashboard/reducer';

export default combineReducers({
  alertReducer,
  registerReducer,
  loginReducer,
  authReducer,
  dashboardReducer,
});
