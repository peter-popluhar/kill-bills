import React from 'react';
import {connect} from 'react-redux';
import {auth} from '../firebase';
import { logoutAction } from '../appAction';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = {
    justifyContent: 'space-between',
    alignItems: 'center'
};

const Header = ({user, logout}) => {

    const logoutFn = () => {
        auth.signOut()
            .then(() => {
                logout();
            });
    };

    return(
        <AppBar position={'static'}>
            <Toolbar style={styles}>
                <Typography component="h1" variant="h5" color="inherit">KillBill&#x24;</Typography>
                <p>{user.email}</p>
                <Button color="inherit" onClick={logoutFn}>Logout</Button>
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
