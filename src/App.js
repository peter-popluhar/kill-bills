import React, { Component } from 'react';
import firebase from './firebase.js';
import { auth, provider } from './firebase.js';
import { capitalize } from 'lodash';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: null,
      itemName: '',
      itemInitialPrice: '',
      items: []
    };
  }

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
      user: this.state.user.email
    };


    this.getDataFromFirebase('orderItems').push(singleBillItem);

    this.setState({
      itemName: '',
      itemInitialPrice: ''
    });
  };

  getOrdersFromDb = () => {
    this.getDataFromFirebase('orderItems').on('value', (snapshot) => {

      let ordersSnapshot = snapshot.val();
      let items = {};
      let newState = [];

      for (let item in ordersSnapshot) {

        if(ordersSnapshot.hasOwnProperty(item)) {

          let order = ordersSnapshot[item];
          let userName = order["user"];

          if (this.state.user.email === userName) {
            items[item] = order;

            newState.unshift({
              itemId: item,
              itemName: items[item].itemName,
              itemInitialPrice: items[item].itemInitialPrice,
              user: items[item].user
            });
          }

          this.setState({
            allItems: newState
          });
        }
      }
    });
  };

  componentDidMount = () => {
    this.getCurrentUser();
    this.getOrdersFromDb();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="itemName" onChange={this.handleChange} value={this.state.itemName}/>
          <input type="number" name="itemInitialPrice"  onChange={this.handleChange} value={this.state.itemInitialPrice}/>
          <input type="submit"/>
        </form>
      </div>
    );
  }
}

export default App;
