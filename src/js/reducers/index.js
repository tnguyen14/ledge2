import { combineReducers } from 'redux';
import form from './form';
import account from './account';
import weeks from './weeks';
import years from './years';
import user from './user';
import notification from './notification';

const rootReducer = combineReducers({
  form,
  account,
  weeks,
  years,
  user,
  notification
});

export default rootReducer;
