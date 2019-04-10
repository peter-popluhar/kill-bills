import React, { useEffect } from 'react';
import firebase from './firebase.js';
import { auth } from './firebase.js';
import Form from './components/form';
import Header from './components/header';
import List from './components/list';
import './App.css'
import {getUserAction, getOrdersFromDbAction} from './appAction';
import {connect} from 'react-redux';

const App = ({user, getUser, getData}) => {

    const getOrdersFromDbFn = () => {
        firebase.database().ref('orderItems').on('value', (snapshot) => {

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
                            itemInitialPrice: items[item].itemInitialPrice,
                            itemNewPrice: items[item].itemNewPrice,
                            user: items[item].user
                        });
                    }
                }
            }

            getData(newState);
        });
    };

    // if user is logged, send him to redux store
    const getUserFn = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                getUser(user);
            }
        });
    };

    useEffect(() => {
        getUserFn();
        getOrdersFromDbFn();
    });


    return (
        <>
            <Header />

            { user &&
                <>
                    <Form user={user} />
                    <List />
                </>
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
