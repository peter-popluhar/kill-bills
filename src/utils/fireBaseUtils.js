import firebase from './../firebase.js';

export const ORDER_ITEMS = 'orderItems';
export const ARCHIVE = 'archive';
export const orderItemsDatabase = firebase.database().ref(ORDER_ITEMS);
export const archiveItemsDatabase = firebase.database().ref(ARCHIVE);

export function getDataFromDbFn(user, dispatcher, database) {

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
                                archiveId: items[item].archiveId,
                                billLocation: items[item].billLocation,
                                itemCurrency: items[item].currency
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
                                totalPrice: items[item].totalPrice,
                                billLocation: items[item].billLocation,
                                itemCurrency: items[item].currency
                            });
                        }

                    }
                }
            }
            dispatcher(newState);
        });
    }
}

export const getUserSettings = (user, dispatcher, settingItem) => {

    if ( user ) {

        firebase.database().ref('settings/' + settingItem + '/' + user.uid).on('value', (snapshot) => {
            let settings = {};

            let settingSnapshot = snapshot.val();

            if ( settingSnapshot !== null ) {
                let value = settingItem;

                for( let key in settingSnapshot) {

                    if(settingSnapshot.hasOwnProperty(key)) {
                        value = settingSnapshot[key];
                    }
                }
                dispatcher(settings.settingItem = value)
            }
        });
    }
};
