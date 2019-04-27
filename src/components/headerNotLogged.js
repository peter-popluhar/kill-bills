import React from 'react';
import { auth, provider } from './../firebase.js';
import {getUserAction} from './../appAction';
import {connect} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = {
    justifyContent: 'space-between',
    alignItems: 'center'
};

const HeaderNotLogged = ({ getUser }) => {

    const loginFn = () => {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                getUser(user);
            });
    };

    return (
        <div>
            <AppBar position={'static'}>
                <Toolbar style={styles}>
                    <Typography component="h1" variant="h5" color="inherit">KillBill&#x24;</Typography>
                    <Button color="inherit" onClick={loginFn}>Login</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (user) => dispatch(getUserAction(user))
    }
};

export default connect(
    null,
    mapDispatchToProps
)(HeaderNotLogged);
