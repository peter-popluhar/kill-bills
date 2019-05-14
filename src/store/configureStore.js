import {createStore} from 'redux';
import {rootReducer} from './../rootReducer';

export function configureStore(initialState = {}) {
	const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
	return createStore(rootReducer, initialState, composeEnhancer());
}
