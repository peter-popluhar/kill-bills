import { combineReducers } from 'redux';
import { userReducer, ordersReducer, archiveReducer } from './appReducer';

export default combineReducers({
	userReducer,
	ordersReducer,
	archiveReducer
})
