import { combineReducers } from 'redux';
import { userReducer, ordersReducer, archiveReducer, archiveGroupByIdReducer, settingsReducer, locationReducer } from './appReducer';

export default combineReducers({
	userReducer,
	ordersReducer,
	archiveReducer,
	archiveGroupByIdReducer,
	settingsReducer,
	locationReducer
})
