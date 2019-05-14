export const GET_USER = 'GET_USER';
export const LOG_OUT = 'LOG_OUT';
export const GET_DATA_ORDERS_FROM_DB = 'GET_DATA_ORDERS_FROM_DB';
export const GET_DATA_ARCHIVE_FROM_DB = 'GET_DATA_ARCHIVE_FROM_DB';
export const ARCHIVE_ITEMS_GROUP_BY_ID = 'ARCHIVE_ITEMS_GROUP_BY_ID';
export const CURRENCY = 'CURRENCY';
export const THEME = 'THEME';
export const LOCATION = 'LOCATION';

export const getUserAction = (payload) => {
	return {
		type: GET_USER,
		payload
	}
};

export const logoutAction = () => {
	return {
		type: LOG_OUT
	}
};

export const getOrdersFromDbAction = (payload) => {
	return {
		type: GET_DATA_ORDERS_FROM_DB,
		payload
	}
};

export const getArchiveFromDbAction = (payload) => {
	return {
		type: GET_DATA_ARCHIVE_FROM_DB,
		payload
	}
};

export const archiveItemsGroupByIdAction = (payload) => {
	return {
		type: ARCHIVE_ITEMS_GROUP_BY_ID,
		payload
	}
};

export const currencyAction = (payload) => {
	return {
		type: CURRENCY,
		payload
	}
};

export const themeAction = (payload) => {
	return {
		type: THEME,
		payload
	}
};

export const locationAction = (payload) => {
	return {
		type: LOCATION,
		payload
	}
};
