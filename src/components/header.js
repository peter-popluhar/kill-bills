import React from 'react';
import {connect} from 'react-redux';
import {auth, provider} from '../firebase';
import {loginAction, logoutAction} from '../appAction';

const Header = ({user, login, logout}) => {

    const loginFn = () => {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                console.log(user)
                // this.getOrdersFromDb();
                login(user)
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
        login: (user) => dispatch(loginAction(user)),
        logout: () => dispatch(logoutAction())
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
