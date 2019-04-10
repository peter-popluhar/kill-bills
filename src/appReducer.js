import {GET_USER, LOG_IN, LOG_OUT} from './appAction';

export const userReducer = (state = {user: null}, action) => {
	switch (action.type) {
		case GET_USER: {
			return {
				...state, user: action.payload
			}
		}
		case LOG_IN: {
			return {
				...state, user: action.payload
			}
		}
		case LOG_OUT: {
			return {
				...state, user: null
			}
		}
		default: return state
	}
}
