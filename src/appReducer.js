import {GET_USER, LOG_OUT, GET_DATA_ORDERS_FROM_DB, GET_DATA_ARCHIVE_FROM_DB} from './appAction';

export const userReducer = (state = {user: null}, action) => {
	switch (action.type) {
		case GET_USER: {
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

export const ordersReducer = (state = [], action) => {
	switch (action.type) {
		case GET_DATA_ORDERS_FROM_DB: {
			return action.payload
		}
		default: return state
	}
}

export const archiveReducer = (state = [], action) => {
	switch (action.type) {
		case GET_DATA_ARCHIVE_FROM_DB: {
			return action.payload
		}
		default: return state
	}
}

