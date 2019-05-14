import firebase from './../firebase.js';

export const ORDER_ITEMS = 'orderItems';
export const ARCHIVE = 'archive';

export function databaseRef(path) { return firebase.database().ref(path)}

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

                        if(database === databaseRef(ORDER_ITEMS)) {
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
        const ref = databaseRef('settings/' + settingItem + '/' + user.uid);

        if (ref) {
            ref.on('value', (snapshot) => {
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
                } else {
                    if(settingItem === 'currency') {
                        dispatcher(settings.settingItem = 'CZK')
                    }
                    if(settingItem === 'theme') {
                        dispatcher(settings.settingItem = 'Light')
                    }
                }
            });
        }

    }
};
