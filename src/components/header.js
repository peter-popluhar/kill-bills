import React from 'react';
import {connect} from 'react-redux';
import {auth, provider} from '../firebase';
import {getUserAction, logoutAction} from '../appAction';

const Header = ({user, getUser, logout}) => {

    const loginFn = () => {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                getUser(user);
            });
    };

    const logoutFn = () => {
        auth.signOut()
            .then(() => {
                logout();
            });
    };

    return(
        <div className="header">
            header: {user ? <><p>{user.email}</p> <button onClick={logoutFn}>Logout</button></> : <button onClick={loginFn}>Login</button>}
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
        getUser: (user) => dispatch(getUserAction(user)),
        logout: () => dispatch(logoutAction())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
