import React, { useEffect } from 'react';
import { auth } from './firebase.js';
import Form from './components/form';
import Header from './components/header';
import OrderList from './components/orderList';
import './App.css'
import {getUserAction, getOrdersFromDbAction} from './appAction';
import {connect} from 'react-redux';
import {provider} from './firebase';
import {getOrdersFromDbFn} from './utils';

const App = ({user, getUser, getData}) => {

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
        getOrdersFromDbFn(user, getData);
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
