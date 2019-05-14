import { combineReducers } from 'redux';
import {LOG_OUT} from './appAction'
import { userReducer, ordersReducer, archiveReducer, archiveGroupByIdReducer, settingsReducer, locationReducer } from './appReducer';

export const appReducer = combineReducers({
	userReducer,
	ordersReducer,
	archiveReducer,
	archiveGroupByIdReducer,
	settingsReducer,
	locationReducer
})

export const rootReducer = (state, action) => {
	if(action.type === LOG_OUT) {
		state = undefined
	}
	return appReducer(state, action)
};
