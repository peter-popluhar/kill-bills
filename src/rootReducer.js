import {combineReducers} from 'redux';
import {userReducer, dataReducer} from './appReducer';

export default combineReducers({
	userReducer,
	dataReducer
})
