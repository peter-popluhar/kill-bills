import firebase from './../firebase.js';

export const ORDER_ITEMS = 'orderItems';
export const ARCHIVE = 'archive';
export const orderItemsDatabase = firebase.database().ref(ORDER_ITEMS);
export const archiveItemsDatabase = firebase.database().ref(ARCHIVE);

export function getDataFromDbFn(user, getData, database) {

    if(user) {
        database.on('value', (snapshot) => {

            let ordersSnapshot = snapshot.val();
            let items = {};
            let newState = [];

            for (let item in ordersSnapshot) {

                if (ordersSnapshot.hasOwnProperty(item)) {

                    let order = ordersSnapshot[item];
                    let userName = order["user"];
                    if (user.email === userName) {
                        items[item] = order;

                        if(database === orderItemsDatabase) {
                            newState.unshift({
                                itemId: item,
                                itemName: items[item].itemName,
                                itemInitialAmount: items[item].itemInitialAmount,
                                itemCalculatedAmount: items[item].itemCalculatedAmount,
                                itemInitialPrice: items[item].itemInitialPrice,
                                itemCalculatedPrice: items[item].itemCalculatedPrice,
                                currentDate: items[item].currentDate,
                                currentTime: items[item].currentTime,
                                user: items[item].user,
                                archiveId: items[item].archiveId
                            });
                        } else {
                            newState.push({
                                itemId: item,
                                itemName: items[item].itemName,
                                itemInitialAmount: items[item].itemInitialAmount,
                                itemCalculatedAmount: items[item].itemCalculatedAmount,
                                itemInitialPrice: items[item].itemInitialPrice,
                                itemCalculatedPrice: items[item].itemCalculatedPrice,
                                currentDate: items[item].currentDate,
                                currentTime: items[item].currentTime,
                                user: items[item].user,
                                archiveId: items[item].archiveId,
                                totalPrice: items[item].totalPrice
                            });
                        }

                    }
                }
            }

            getData(newState);
        });
    }
}
