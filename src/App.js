import React, { Component } from 'react';
import firebase from './firebase.js';
import { auth, provider } from './firebase.js';
import { capitalize } from 'lodash';
import Form from './components/form';
import Header from './components/header';
import List from './components/list';

let itemNewPrice;
let newValue;

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

  manipulateItem = (itemId, action) => {

    // eslint-disable-next-line
    this.state.allItems.map((item) => {

      if (item.itemId === itemId) {

        switch(action) {
          case 'increment': {
            itemNewPrice = item.itemNewPrice + item.itemInitialPrice;
            this.getDataFromFirebase(`/orderItems/${itemId}`).update({
              itemNewPrice: itemNewPrice
            });
            break;
          }
          case 'decrement': {
            itemNewPrice = item.itemNewPrice - item.itemInitialPrice;
            this.getDataFromFirebase(`/orderItems/${itemId}`).update({
              itemNewPrice: itemNewPrice
            });
            break;
          }
          case 'delete': {
            const itemRef = this.getDataFromFirebase(`/orderItems/${itemId}`);
            itemRef.remove();
            break;
          }
          case item.itemName: {
            newValue = prompt('new name', '');
            this.getDataFromFirebase(`/orderItems/${itemId}`).update({
              itemName: newValue
            });
            break;
          }
          case item.itemInitialPrice: {
            newValue = Number(prompt('new price', ''));
            this.getDataFromFirebase(`/orderItems/${itemId}`).update({
              itemInitialPrice: newValue
            });
            break;
          }
          default: // Do nothing
        }
      }
    });
  };

  getOrdersFromDb = () => {
    this.getDataFromFirebase('orderItems').on('value', (snapshot) => {

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

      { this.state.user ?
          <>
            <p>form</p>
            <Form
                handleSubmit={this.handleSubmit}
                handleChange={this.handleChange}
                itemName={this.state.itemName}
                itemInitialPrice={this.state.itemInitialPrice}
            />
            <ul>
              {this.state.allItems.map((item) => {
                return(
                    <li key={item.itemId}>
                      <p onClick={() => this.manipulateItem(item.itemId, item.itemName)}>{item.itemName}</p>
                      <p onClick={() => this.manipulateItem(item.itemId, item.itemInitialPrice)}>{item.itemInitialPrice}</p>
                      <p>{item.itemNewPrice}</p>
                      <button onClick={() => this.manipulateItem(item.itemId, 'increment')}>+1</button>
                      <button onClick={() => this.manipulateItem(item.itemId, 'decrement')}>-1</button>
                      <button onClick={() => this.manipulateItem(item.itemId, 'delete')}>delete</button>
                    </li>
                )
              })}
            </ul>
          </>
           :
          <button onClick={this.login}>Login</button>
      }
      </>
    );
  }
}

export default App;
