import { configureStore } from 'https://esm.sh/@reduxjs/toolkit';
import reducer from './reducers/index.js';

const store = configureStore({ reducer });

export default store;
