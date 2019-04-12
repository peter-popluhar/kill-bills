import React from 'react';
import firebase from './../firebase.js';
import {connect} from 'react-redux';
import {getCurrentItemTime, ORDER_ITEMS} from './../utils';


const INCREMENT = 'increment';
const DECREMENT = 'decrement';
const DELETE = 'delete';
const CHANGE_ITEM_NAME = 'changeItemName';
const CHANGE_ITEM_PRICE = 'changeItemPrice';

// todo: user can enter to prompt dialog for price only number

const OrderList = ({allItems}) => {
    let itemNewPrice;
    let itemNewAmount;
    let newValue;

    const manipulateItem = (itemId, action) => {
        const itemRef = firebase.database().ref(`/${ORDER_ITEMS}/${itemId}`);

        // eslint-disable-next-line
        allItems.map((item) => {

            if (item.itemId === itemId) {

                switch(action) {
                    case INCREMENT: {
                        itemNewPrice = item.itemNewPrice + item.itemInitialPrice;
                        itemNewAmount = item.itemNewAmount + item.itemInitialAmount;
                        itemRef.update({
                            itemNewPrice: itemNewPrice,
                            itemNewAmount: itemNewAmount,
                            currentTime: getCurrentItemTime()
                        });
                        break;
                    }
                    case DECREMENT: {
                        itemNewPrice = item.itemNewPrice - item.itemInitialPrice;
                        itemNewAmount = item.itemNewAmount - item.itemInitialAmount;
                        itemRef.update({
                            itemNewPrice: itemNewPrice,
                            itemNewAmount: itemNewAmount,
                            currentTime: getCurrentItemTime()
                        });
                        break;
                    }
                    case DELETE: {
                        itemRef.remove();
                        break;
                    }
                    case CHANGE_ITEM_NAME: {
                        newValue = prompt('new name', '');
                        if(newValue === null) {
                            return null
                        }
                        itemRef.update({
                            itemName: newValue
                        });
                        break;
                    }
                    case CHANGE_ITEM_PRICE: {
                        newValue = prompt('new price', '');
                        if(newValue === null) {
                            return null
                        }
                        itemNewPrice = newValue * item.itemNewAmount;
                        itemRef.update({
                            itemInitialPrice: Number(newValue),
                            itemNewPrice: itemNewPrice
                        });
                        break;
                    }
                    default: // Do nothing
                }
            }
        });
    };

   return (
       <>
           {allItems &&
               <div className="list">
                   <span>list: </span>
                   <ul>
                       {allItems.map((item) => {
                           return(
                               <li key={item.itemId}>
                                   <p onClick={() => manipulateItem(item.itemId, CHANGE_ITEM_NAME)}>item name: {item.itemName}</p>
                                   <p>items: {item.itemNewAmount}</p>
                                   <p onClick={() => manipulateItem(item.itemId, CHANGE_ITEM_PRICE)}>price: {item.itemInitialPrice}</p>
                                   <p>new price: {item.itemNewPrice}</p>
                                   <p>time: {item.currentTime}</p>
                                   <button onClick={() => manipulateItem(item.itemId, INCREMENT)}>+1</button>
                                   <button onClick={() => manipulateItem(item.itemId, DECREMENT)}>-1</button>
                                   <button onClick={() => manipulateItem(item.itemId, DELETE)}>delete</button>
                               </li>
                           )
                       })}
                   </ul>
               </div>
           }
       </>
   )
};

const mapStateToProps = (state) => {
    return {
        allItems: state.ordersReducer
    }
};

export default connect(
    mapStateToProps
)(OrderList);
