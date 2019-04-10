import React, { Component } from 'react';
import firebase from './firebase.js';
import { auth, provider } from './firebase.js';
import Form from './components/form';
import Header from './components/header';
import List from './components/list';
import './App.css'
import {getUserAction} from './appAction';
import {connect} from 'react-redux';

class App extends Component {
    state = {
        allItems: []
    };

  getOrdersFromDb = () => {
      firebase.database().ref('orderItems').on('value', (snapshot) => {

      let ordersSnapshot = snapshot.val();
      let items = {};
      let newState = [];

      for (let item in ordersSnapshot) {

        if (ordersSnapshot.hasOwnProperty(item)) {

        let order = ordersSnapshot[item];
        let userName = order["user"];
          if (this.props.user.email === userName) {
            items[item] = order;

            newState.unshift({
              itemId: item,
              itemName: items[item].itemName,
              itemInitialPrice: items[item].itemInitialPrice,
              itemNewPrice: items[item].itemNewPrice,
              user: items[item].user
            });
          }
        }
      }

      this.setState({
        allItems: newState
      });
    });
  };

    // if user is logged, send him to redux store
    getUserFn = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                this.props.getUser(user);
            }
        });
    };

  componentDidMount() {
    this.getUserFn();
    this.getOrdersFromDb();
  };

  render() {

      const {allItems} = this.state;
      const {user} = this.props;

    return (
      <>
        <Header />

      { user &&
          <>
            <Form user={user} />
            <div className="list">
               <List allItems={allItems} />
            </div>
          </>
      }
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getUser: (user) => dispatch(getUserAction(user))
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
