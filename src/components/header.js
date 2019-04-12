import React from 'react';
import {connect} from 'react-redux';
import {auth} from '../firebase';
import { logoutAction} from '../appAction';

const Header = ({user, getUser, logout}) => {

    const logoutFn = () => {
        auth.signOut()
            .then(() => {
                logout();
            });
    };

    return(
        <div className="header">
            <p>{user.email}</p> <button onClick={logoutFn}>Logout</button>
        </div>
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
