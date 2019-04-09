import React, { Component } from 'react';
import firebase from './firebase.js';
import { auth, provider } from './firebase.js';
import { capitalize } from 'lodash';
import Form from './components/form';
import Header from './components/header';
import List from './components/list';
import './App.css'

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      allItems: []
    };
  }

  login = () => {
    auth.signInWithPopup(provider)
        .then((result) => {
          const user = result.user;
          this.setState({
            user
          });
          this.getOrdersFromDb();
        });
  };

  logout = () => {
    auth.signOut()
        .then(() => {
          this.setState({
            user: null,
            itemName: '',
            itemInitialPrice: '',
            allItems: []
          });
        });
  };

  getCurrentUser = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user,
          uid: user.uid
        });
      }
    });
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
          if (this.state.user.email === userName) {
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

  componentDidMount = () => {
    this.getCurrentUser();
    this.getOrdersFromDb();
  };

  render() {
    return (
      <>
        <Header>
          { !this.state.user ?
              <button onClick={this.login}>Login</button> :
              <button onClick={this.logout}>Logout</button>
          }
        </Header>

      { this.state.user &&
          <>
          <Form user={this.state.user} />
            <div className="list">
               <List allItems={this.state.allItems} />
            </div>
          </>
      }
      </>
    );
  }
}

export default App;
