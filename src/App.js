import React, { useEffect } from 'react';
import { auth } from './firebase.js';
import Form from './components/form';
import Header from './components/header';
import OrderList from './components/orderList';
import './App.css'
import {getUserAction, getOrdersFromDbAction} from './appAction';
import {connect} from 'react-redux';
import {provider} from './firebase';
import {itemsDatabase} from './utils';

const App = ({user, getUser, getData}) => {

    const getOrdersFromDbFn = () => {

        if(user) {
            itemsDatabase.on('value', (snapshot) => {

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

    // if user is logged, send him to redux store
    const getUserFn = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                getUser(user);
            }
        });
    };

    const loginFn = () => {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                getUser(user);
                getOrdersFromDbFn();
            });
    };

    useEffect(() => {
        getUserFn();
        getOrdersFromDbFn();
    });

    return (
        <>
            { user ?
                <>
                    <Header />
                    <Form />
                    <OrderList />
                </>
                :
                <button onClick={loginFn}>Login</button>
            }
        </>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (user) => dispatch(getUserAction(user)),
        getData: (allOrders) => dispatch(getOrdersFromDbAction(allOrders))
    }
};

const mapStateToProps = (state) => (
    {
        user: state.userReducer.user,
        payload: state.dataReducer.payload
    }
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
