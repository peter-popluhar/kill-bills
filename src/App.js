import React, { useEffect } from 'react';
import { auth } from './firebase.js';
import Form from './components/form';
import Header from './components/header';
import OrderList from './components/orderList';
import './App.css'
import {getUserAction, getOrdersFromDbAction, getArchiveFromDbAction} from './appAction';
import {connect} from 'react-redux';
import {provider} from './firebase';
import {getOrdersFromDbFn} from './utils';
import {getArchivedOrdersFromDbFn} from './utils';
import ArchiveList from './components/archiveList';

const App = ({user, getUser, getOrders, getArchive}) => {

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
                getOrdersFromDbFn(user, getOrders);
                getArchivedOrdersFromDbFn(user, getArchive)
            });
    };

    useEffect(() => {
        getUserFn();
        getOrdersFromDbFn(user, getOrders);
        getArchivedOrdersFromDbFn(user, getArchive);
    });

    return (
        <>
            { user ?
                <>
                    <Header />
                    <Form />
                    <OrderList />
                    <ArchiveList />
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
        getOrders: (orders) => dispatch(getOrdersFromDbAction(orders)),
        getArchive: (archive) => dispatch(getArchiveFromDbAction(archive))
    }
};

const mapStateToProps = (state) => (
    {
        user: state.userReducer.user,
        orders: state.ordersReducer.orders,
        archive: state.ordersReducer.archive
    }
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
