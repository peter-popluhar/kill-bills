export const GET_USER = 'GET_USER';
export const LOG_OUT = 'LOG_OUT';
export const GET_DATA_ORDERS_FROM_DB = 'GET_DATA_ORDERS_FROM_DB';

export const getUserAction = (payload) => {
	return {
		type: GET_USER,
		payload
	}
}

export const logoutAction = () => {
	return {
		type: LOG_OUT
	}
}

export const getOrdersFromDbAction = (payload) => {
	return {
		type: GET_DATA_ORDERS_FROM_DB,
		payload
	}
}
