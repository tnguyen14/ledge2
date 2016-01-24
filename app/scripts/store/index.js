import { applyMiddleware, createStore, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from '../reducers';

const createStoreWithMiddleware = compose(
	applyMiddleware(
		thunkMiddleware,
		createLogger({
			predicate: function () {
				return process.env.NODE_ENV === 'development';
			}
		})
	),
	window.devToolsExtension ? window.devToolsExtension() : function (f) { return f; }
)(createStore);

export default function (initialState) {
	return createStoreWithMiddleware(rootReducer, initialState);
}
