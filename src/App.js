import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { auth } from './firebase.js';
import Header from './components/header';
import {
    getUserAction,
    getOrdersFromDbAction,
    getArchiveFromDbAction,
    currencyAction,
    themeAction
} from './appAction';
import { connect } from 'react-redux';
import { getDataFromDbFn, getUserSettings, databaseRef, ORDER_ITEMS, ARCHIVE } from './utils/fireBaseUtils';
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

const App = ({ user, getUser, getOrders, getArchive, getCurrency, getTheme }) => {

    // if user is logged, send him to redux store
    const getUserFn = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                getUser(user);
            }
        });
    };

    const getUserSettingsFn = () => {
        getCurrency(getUserSettings(user, getCurrency, 'currency'));
        getTheme(getUserSettings(user, getTheme, 'theme'))
    }

    useEffect(() => {
        getUserFn();
        getDataFromDbFn(user, getOrders, databaseRef(ORDER_ITEMS));
        getDataFromDbFn(user, getArchive, databaseRef(ARCHIVE));
        getUserSettingsFn()
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
        getArchive: (archive) => dispatch(getArchiveFromDbAction(archive)),
        getCurrency: (currency) => dispatch(currencyAction(currency)),
        getTheme: (theme) => dispatch(themeAction(theme))
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

App.propTypes = {
    user: PropTypes.object,
    getUser: PropTypes.func,
    getOrders: PropTypes.func,
    getArchive: PropTypes.func,
    getCurrency: PropTypes.func,
    getTheme: PropTypes.func
};
