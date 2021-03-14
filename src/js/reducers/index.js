import { combineReducers } from 'redux';
import form from './form';
import account from './account';
import weeks from './weeks';
import years from './years';
import user from './user';
import app from './app';

const rootReducer = combineReducers({
  app,
  form,
  account,
  weeks,
  years,
  user
});

export default rootReducer;
