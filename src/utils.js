import firebase from './firebase.js';

export const ORDER_ITEMS = 'orderItems';
export const ARCHIVE = 'archive';

export const orderItemsDatabase = firebase.database().ref(ORDER_ITEMS);
export const archiveItemsDatabase = firebase.database().ref(ARCHIVE);

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

export function getOrdersFromDbFn(user, getData) {

    if(user) {
        orderItemsDatabase.on('value', (snapshot) => {

            let ordersSnapshot = snapshot.val();
            let items = {};
            let newState = [];

            for (let item in ordersSnapshot) {

                if (ordersSnapshot.hasOwnProperty(item)) {

                    let order = ordersSnapshot[item];
                    let userName = order["user"];
                    if (user.email === userName) {
                        items[item] = order;

                        newState.unshift({
                            itemId: item,
                            itemName: items[item].itemName,
                            itemInitialAmount: items[item].itemInitialAmount,
                            itemNewAmount: items[item].itemNewAmount,
                            itemInitialPrice: items[item].itemInitialPrice,
                            itemNewPrice: items[item].itemNewPrice,
                            currentDate: items[item].currentDate,
                            currentTime: items[item].currentTime,
                            user: items[item].user
                        });
                    }
                }
            }

            getData(newState);
        });
    }

};

export function getArchivedOrdersFromDbFn(user, getData) {

    if(user) {
        archiveItemsDatabase.on('value', (snapshot) => {

            let ordersSnapshot = snapshot.val();
            let items = {};
            let newState = [];

            for (let item in ordersSnapshot) {

                if (ordersSnapshot.hasOwnProperty(item)) {

                    let order = ordersSnapshot[item];
                    let userName = order["user"];

                    if (user.email === userName) {
                        items[item] = order;

                        newState.push({
                            itemId: item,
                            itemName: items[item].itemName,
                            itemInitialAmount: items[item].itemInitialAmount,
                            itemNewAmount: items[item].itemNewAmount,
                            itemInitialPrice: items[item].itemInitialPrice,
                            itemNewPrice: items[item].itemNewPrice,
                            currentDate: items[item].currentDate,
                            currentTime: items[item].currentTime,
                            archiveId: items[item].archiveId,
                            user: items[item].user
                        });
                    }
                }
            }

            getData(newState);
        });
    }
};
