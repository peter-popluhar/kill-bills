import React, { Component } from 'react';
import firebase from './firebase.js';
import { auth, provider } from './firebase.js';
import { capitalize } from 'lodash';
import Form from './components/form';
import Header from './components/header';
import List from './components/list';

import './App.css'

//import getOrdersFromDb from './components/getOrdersFromDb';


class App extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      itemName: '',
      itemInitialPrice: '',
      itemNewPrice: '',
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

  getDataFromFirebase = (data) => {
    return firebase.database().ref(data);
  };

  handleChange = (e) => this.setState({[e.target.name]: e.target.value});

  handleSubmit = (e) => {
    e.preventDefault();

    const singleBillItem = {
      itemName: capitalize(this.state.itemName),
      itemInitialPrice: Number(this.state.itemInitialPrice),
      user: this.state.user.email,
      itemNewPrice: Number(this.state.itemInitialPrice)
    };


    this.getDataFromFirebase('orderItems').push(singleBillItem);

    this.setState({
      itemName: '',
      itemInitialPrice: ''
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

    clearCurrentBill = () => {
        let ref = firebase.database().ref('orderItems')

        ref.orderByChild('user').equalTo(this.state.user.email).once('value', function(snapshot){
            let updates = {};

            snapshot.forEach(function(child) {
                updates[child.key] = null;
            });

            ref.update(updates);
        });

        this.setState({
            archiveId: false
        });
    };

  componentDidMount = () => {
    this.getCurrentUser();
    this.getOrdersFromDb();
  };

  render() {
      console.log(this.state)
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
            <Form
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange}
                itemName={this.state.itemName}
                itemInitialPrice={this.state.itemInitialPrice}
            />
          <button onClick={this.clearCurrentBill}>clear</button>
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
