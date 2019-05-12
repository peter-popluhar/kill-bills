import { combineReducers } from 'redux';
import { userReducer, ordersReducer, archiveReducer, archiveGroupByIdReducer, settingsReducer } from './appReducer';

export default combineReducers({
	userReducer,
	ordersReducer,
	archiveReducer,
	archiveGroupByIdReducer,
	settingsReducer
})
