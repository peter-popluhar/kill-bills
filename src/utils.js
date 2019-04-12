import firebase from './firebase.js';

export const ORDER_ITEMS_DB = 'orderItems';
export const ARCHIVE_DB = 'archive';
export const INCREMENT = 'increment';
export const DECREMENT = 'decrement';
export const DELETE = 'delete';
export const CHANGE_ITEM_NAME = 'changeItemName';
export const CHANGE_ITEM_PRICE = 'changeItemPrice';

export const itemsDatabase = firebase.database().ref(ORDER_ITEMS_DB);
export const archiveDatabase = firebase.database().ref(ARCHIVE_DB);

export function getOrderDate() {
    let currentBillDate = new Date();
    let currentBillDay = currentBillDate.getDate();
    let currentBillMonth = currentBillDate.getMonth() + 1;
    let currentBillYear = currentBillDate.getFullYear();

    return `${currentBillDay}/${currentBillMonth}/${currentBillYear}`;
};

export function getCurrentItemTime() {
    let currentItemDate = new Date();
    let currentItemHour = currentItemDate.getHours();
    let currentItemMinute = currentItemDate.getMinutes();
    let currentItemSeconds = currentItemDate.getSeconds();

    return `${currentItemHour}:${currentItemMinute}:${currentItemSeconds}`;
};
