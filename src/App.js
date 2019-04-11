import React, { Component } from 'react';
import firebase from './firebase.js';
import { auth } from './firebase.js';
import Form from './components/form';
import Header from './components/header';
import OrderList from './components/orderList';
import './App.css'
import {getUserAction, getOrdersFromDbAction} from './appAction';
import {connect} from 'react-redux';

class App extends Component {

    getOrdersFromDbFn = () => {
        firebase.database().ref('orderItems').on('value', (snapshot) => {

            let ordersSnapshot = snapshot.val();
            let items = {};
            let newState = [];

            for (let item in ordersSnapshot) {

                if (ordersSnapshot.hasOwnProperty(item)) {

                    let order = ordersSnapshot[item];
                    let userName = order["user"];
                    if (this.props.user.email === userName) {
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

            this.props.getData(newState);
        });
    };

    // if user is logged, send him to redux store
    getUserFn = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.props.getUser(user);
            }
        });
    };

    componentDidMount() {
        this.getUserFn();
        this.getOrdersFromDbFn();
    };

    render() {

        const {user} = this.props;

        return (
            <>
                <Header />

                { user &&
                    <>
                        <Form />
                        <OrderList />
                    </>
                }
            </>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (user) => dispatch(getUserAction(user)),
        getData: (allOrders) => dispatch(getOrdersFromDbAction(allOrders))
    }
};

const mapStateToProps = (state) => (
    {
        user: state.userReducer.user
    }
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
