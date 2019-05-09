import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { auth } from './firebase.js';
import Header from './components/header';
import { getUserAction, getOrdersFromDbAction, getArchiveFromDbAction } from './appAction';
import { connect } from 'react-redux';
import { getDataFromDbFn, archiveItemsDatabase, orderItemsDatabase } from './utils/fireBaseUtils';
import HeaderNotLogged from './components/headerNotLogged';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import TabsNav from './components/tabsNav';
import CssBaseline from '@material-ui/core/CssBaseline';
import {GlobalStyle} from './components/styled/globalStyles'

const theme = createMuiTheme({
    palette: {
        primary: blue
    },
    typography: {
        useNextVariants: true
    },
});

const App = ({ user, getUser, getOrders, getArchive }) => {

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
        getDataFromDbFn(user, getOrders, orderItemsDatabase);
        getDataFromDbFn(user, getArchive, archiveItemsDatabase);
    },[user]);

    return (
        <MuiThemeProvider theme={theme}>
            <GlobalStyle />
            <CssBaseline />

            { user ?
                <>
                    <Header />
                    <TabsNav />
                </>
                :
                <HeaderNotLogged />

            }
        </MuiThemeProvider>
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
        orders: state.ordersReducer,
        archive: state.archiveReducer
    }
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

App.propTypes = {
    user: PropTypes.object,
    getUser: PropTypes.func,
    getOrders: PropTypes.func,
    getArchive: PropTypes.func
};
