import React from 'react';
import firebase from './../firebase.js';
import {connect} from 'react-redux';

const OrderList = ({allItems}) => {
    let itemNewPrice;
    let newValue;


    const manipulateItem = (itemId, action) => {
        const itemRef = firebase.database().ref(`/orderItems/${itemId}`);

        // eslint-disable-next-line
        allItems.map((item) => {

            if (item.itemId === itemId) {

                switch(action) {
                    case 'increment': {
                        itemNewPrice = item.itemNewPrice + item.itemInitialPrice;
                        itemRef.update({
                            itemNewPrice: itemNewPrice
                        });
                        break;
                    }
                    case 'decrement': {
                        itemNewPrice = item.itemNewPrice - item.itemInitialPrice;
                        itemRef.update({
                            itemNewPrice: itemNewPrice
                        });
                        break;
                    }
                    case 'delete': {
                        itemRef.remove();
                        break;
                    }
                    case item.itemName: {
                        newValue = prompt('new name', '');
                        if(newValue === null) {
                            return
                        }
                        itemRef.update({
                            itemName: newValue
                        });
                        break;
                    }
                    case item.itemInitialPrice: {
                        newValue = prompt('new price', '');
                        if(newValue === null) {
                            return
                        }
                        itemRef.update({
                            itemInitialPrice: Number(newValue)
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
                                   <p onClick={() => manipulateItem(item.itemId, item.itemName)}>{item.itemName}</p>
                                   <p onClick={() => manipulateItem(item.itemId, item.itemInitialPrice)}>{item.itemInitialPrice}</p>
                                   <p>{item.itemNewPrice}</p>
                                   <p>{item.currentTime}</p>
                                   <button onClick={() => manipulateItem(item.itemId, 'increment')}>+1</button>
                                   <button onClick={() => manipulateItem(item.itemId, 'decrement')}>-1</button>
                                   <button onClick={() => manipulateItem(item.itemId, 'delete')}>delete</button>
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
        allItems: state.dataReducer
    }
};

export default connect(
    mapStateToProps
)(OrderList);
