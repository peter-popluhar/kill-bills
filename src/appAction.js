export const GET_USER = 'GET_USER';
export const LOG_OUT = 'LOG_OUT';
export const LOG_IN = 'LOG_IN';

export const getUserAction = (payload) => {
	return {
		type: GET_USER,
		payload
	}
}

export const loginAction = (payload) => {
	return {
		type: LOG_IN,
		payload
	}
}

export const logoutAction = () => {
	return {
		type: LOG_OUT
	}
}
