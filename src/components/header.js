import React from 'react';
import {connect} from 'react-redux';
import {auth} from '../firebase';
import { logoutAction } from '../appAction';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

const Header = ({user, getUser, logout}) => {

    const logoutFn = () => {
        auth.signOut()
            .then(() => {
                logout();
            });
    };

    return(
        <AppBar>
            <Toolbar>
                <p>{user.email}</p> <button onClick={logoutFn}>Logout</button>
            </Toolbar>
        </AppBar>
    )
};

const mapStateToProps = (state) => (
    {
        user: state.userReducer.user
    }
);

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logoutAction())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
