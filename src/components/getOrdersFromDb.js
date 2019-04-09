import firebase from './../firebase.js';

export default function getOrdersFromDb(userName) {

    firebase.database().ref('orderItems').on('value', (snapshot) => {

        let ordersSnapshot = snapshot.val();
        let items = {};
        let newState = [];

        for (let item in ordersSnapshot) {

            if (ordersSnapshot.hasOwnProperty(item)) {

                let order = ordersSnapshot[item];
                let user = order["user"];

                if (userName.email === user) {
                    items[item] = order;

                    newState.unshift({
                        itemId: item,
                        itemName: items[item].itemName,
                        itemInitialPrice: items[item].itemInitialPrice,
                        itemNewPrice: items[item].itemNewPrice,
                        user: items[item].user
                    });
                }
            }

            return newState;
        }
    });


};
