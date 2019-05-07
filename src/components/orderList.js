import React from 'react';
import firebase from './../firebase.js';
import {connect} from 'react-redux';
import { ORDER_ITEMS } from './../utils/fireBaseUtils';
import { getCurrentItemTime} from './../utils/appUtils';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import Delete from '@material-ui/icons/Delete';
import {OrderListButtons} from './styled/orderListButtons';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TextFieldsIcon from '@material-ui/icons/TextFields';

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

               <>
                   {allItems.map((item) => {
                       return(
                           <Paper key={item.itemId} square style={{margin: '2%'}}>
                               <ExpansionPanel>
                                   <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{padding: '3% 24px'}}>
                                       <div>
                                           <Typography component="p" variant="subtitle2">
                                            {item.currentTime}
                                           </Typography>
                                           <Typography component="p" variant="h5">
                                               {item.itemName} {item.itemNewAmount} x {item.itemInitialPrice} = {item.itemNewPrice}
                                           </Typography>
                                       </div>
                                   </ExpansionPanelSummary>
                                   <ExpansionPanelDetails>
                                       <OrderListButtons>
                                           <Fab children={<AddIcon fontSize="small" />} onClick={() => manipulateItem(item.itemId, INCREMENT)} color="primary" aria-label="Add one item" size='small'/>
                                           <Fab children={<RemoveIcon fontSize="small" />} onClick={() => manipulateItem(item.itemId, DECREMENT)} color="secondary" aria-label="Remove one item" size='small' />
                                           <Fab children={<Delete fontSize="small" />} onClick={() => manipulateItem(item.itemId, DELETE)} color="secondary" aria-label="Delete item" size='small' />
                                           <Fab children={<TextFieldsIcon fontSize="small" />} onClick={() => manipulateItem(item.itemId, CHANGE_ITEM_NAME)} aria-label="Edit item name" size='small' />
                                           <Fab children={<AttachMoneyIcon fontSize="small" />} onClick={() => manipulateItem(item.itemId, CHANGE_ITEM_PRICE)} aria-label="Edit item price" size='small' />
                                       </OrderListButtons>
                                   </ExpansionPanelDetails>
                               </ExpansionPanel>
                           </Paper>
                       )
                   })}
               </>

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
