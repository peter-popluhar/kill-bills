import React, { Component } from 'react';
import firebase from './firebase.js';
import { auth, provider } from './firebase.js';
import { capitalize } from 'lodash';
import Form from './components/form';
import Header from './components/header';
import List from './components/list';

let itemNewPrice;
let itemNewName;

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
          //this.getOrdersFromDb();
          this.getAllItemsFromDB();
          //this.getAllArchivedItemsFromDB();
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

  deleteItem = (itemId) => {
    const itemRef = this.getDataFromFirebase(`/orderItems/${itemId}`);
    itemRef.remove();
  };

  incrementItem = (itemId) => {

    // eslint-disable-next-line
    this.state.allItems.map(function (item) {
      if (item.itemId === itemId) {
        itemNewPrice = item.itemNewPrice + item.itemInitialPrice;
      }
    });

    this.getDataFromFirebase(`/orderItems/${itemId}`).update({
      itemNewPrice: itemNewPrice
    });
  };

  decrementItem = (itemId) => {

    // eslint-disable-next-line
    this.state.allItems.map(function (item) {
      if (item.itemId === itemId) {
        itemNewPrice = item.itemNewPrice - item.itemInitialPrice;
      }
    });

    this.getDataFromFirebase(`/orderItems/${itemId}`).update({
      itemNewPrice: itemNewPrice
    });

  };

  updateName = (itemId) => {

    // eslint-disable-next-line
    this.state.allItems.map(function (item) {
      if (item.itemId === itemId) {
        itemNewName = 'test';
      }
    });

    this.getDataFromFirebase(`/orderItems/${itemId}`).update({
      itemName: itemNewName
    });

  };

  //getOrdersFromDb = () => {
  //  this.getDataFromFirebase('orderItems').on('value', (snapshot) => {
  //
  //    let ordersSnapshot = snapshot.val();
  //    let items = {};
  //    let newState = [];
  //
  //    for (let item in ordersSnapshot) {
  //
  //      if(ordersSnapshot.hasOwnProperty(item)) {
  //
  //        let order = ordersSnapshot[item];
  //        let userName = order["user"];
  //
  //        if (this.state.user.email === userName) {
  //          items[item] = order;
  //
  //          newState.unshift({
  //            itemId: item,
  //            itemName: items[item].itemName,
  //            itemInitialPrice: items[item].itemInitialPrice,
  //            user: items[item].user
  //          });
  //        }
  //
  //        this.setState({
  //          allItems: newState
  //        });
  //      }
  //    }
  //  });
  //};

  getAllItemsFromDB = () => {
    this.getDataFromFirebase('orderItems').on('value', (snapshot) => {

      let gotItems = snapshot.val();
      let items = {};

      let newState = [];
      let allItemsNewPrices = [];
      let allItemsTime = [];
      let getCurrency = [];
      let getMaxSpend = [];
      let getTheme = [];

      for (let item in gotItems) {
        let obj = gotItems[item];
        let userName = obj["user"];

        if (this.state.user.email === userName) {
          items[item] = obj;

          allItemsNewPrices.push(Number(items[item].itemNewPrice));
          allItemsTime.push(items[item].currentTime);
          getCurrency.push(items[item].currency);
          getMaxSpend.push(items[item].maxSpend);
          getTheme.push(items[item].theme);

          newState.unshift({
            itemId: item,
            itemName: items[item].itemName,
            itemInitialAmount: items[item].itemInitialAmount,
            itemNewAmount: items[item].itemNewAmount,
            itemInitialPrice: items[item].itemInitialPrice,
            itemNewPrice: items[item].itemNewPrice,
            currentDate: items[item].currentDate,
            currentTime: items[item].currentTime,
            user: items[item].user,
            archiveId: items[item].archiveId,
            currency: items[item].currency,
            maxSpend: items[item].maxSpend,
            theme: items[item].theme
          });

          this.setState({
            archiveId: items[item].archiveId
          });
        }
      }

      let totalPrice = allItemsNewPrices.reduce((a, b) => a + b, 0);

      let lastItemTime = allItemsTime.sort(function (a, b) {
        return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
      });

      let lastItemTimeItem = lastItemTime[lastItemTime.length - 1];

      this.setState({
        allItems: newState,
        totalPrice: totalPrice,
        lastOrderTime: lastItemTimeItem
      });
    });
  };

  componentDidMount = () => {
    this.getCurrentUser();
    //this.getOrdersFromDb();
    this.getAllItemsFromDB();
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
                      <p onClick={() => this.updateName(item.itemId)}>{item.itemName}</p>
                      <p>{item.itemInitialPrice}</p>
                      <p>{item.itemNewPrice}</p>
                      <button onClick={() => this.incrementItem(item.itemId)}>+1</button>
                      <button onClick={() => this.decrementItem(item.itemId)}>-1</button>
                      <button onClick={() => this.deleteItem(item.itemId)}>delete</button>
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
