import React, { useEffect } from 'react';
import { auth, provider } from './firebase.js';
import Form from './components/form';
import Header from './components/header';
import OrderList from './components/orderList';
import './App.css'
import { getUserAction, getOrdersFromDbAction, getArchiveFromDbAction } from './appAction';
import { connect } from 'react-redux';
import { getDataFromDbFn, archiveItemsDatabase, orderItemsDatabase } from './utils/fireBaseUtils';
import ArchiveList from './components/archiveList';
import HeaderNotLogged from './components/headerNotLogged';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const App = ({ user, getUser, getOrders, getArchive }) => {

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
                getDataFromDbFn(user, getOrders, orderItemsDatabase);
                getDataFromDbFn(user, getArchive, archiveItemsDatabase)
            });
    };

    useEffect(() => {
        getUserFn();
        getDataFromDbFn(user, getOrders, orderItemsDatabase);
        getDataFromDbFn(user, getArchive, archiveItemsDatabase);
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
                <HeaderNotLogged />

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
