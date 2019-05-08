import React from 'react';
import firebase from './../firebase.js';
import {connect} from 'react-redux';
import { ORDER_ITEMS } from './../utils/fireBaseUtils';
import { getCurrentItemTime } from './../utils/appUtils';
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
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const INCREMENT = 'increment';
const DECREMENT = 'decrement';
const DELETE = 'delete';
const CHANGE_ITEM_NAME = 'changeItemName';
const CHANGE_ITEM_PRICE = 'changeItemPrice';

// todo: user can enter to prompt dialog for price only number

const OrderList = ({allItems}) => {
    let itemCalculatedPrice;
    let itemCalculatedAmount;
    let newValue;
    const MySwal = withReactContent(Swal);

    const manipulateItem = (itemId, action) => {
        const itemRef = firebase.database().ref(`/${ORDER_ITEMS}/${itemId}`);

        // eslint-disable-next-line
        allItems.map((item) => {

            if (item.itemId === itemId) {

                switch(action) {
                    case INCREMENT: {
                        itemCalculatedPrice = item.itemCalculatedPrice + item.itemInitialPrice;
                        itemCalculatedAmount = item.itemCalculatedAmount + item.itemInitialAmount;
                        itemRef.update({
                            itemCalculatedPrice: itemCalculatedPrice,
                            itemCalculatedAmount: itemCalculatedAmount,
                            currentTime: getCurrentItemTime()
                        });
                        break;
                    }
                    case DECREMENT: {
                        itemCalculatedPrice = item.itemCalculatedPrice - item.itemInitialPrice;
                        itemCalculatedAmount = item.itemCalculatedAmount - item.itemInitialAmount;
                        itemRef.update({
                            itemCalculatedPrice: itemCalculatedPrice,
                            itemCalculatedAmount: itemCalculatedAmount,
                            currentTime: getCurrentItemTime()
                        });
                        break;
                    }
                    case DELETE: {
                        itemRef.remove();
                        break;
                    }
                    case CHANGE_ITEM_NAME: {
                        MySwal.fire({
                            title: <Typography component="p" variant="h5">Enter new item name:</Typography>,
                            input: 'text'
                        }).then((result) => {
                            newValue = result.value;

                            if(newValue) {
                                itemRef.update({
                                    itemName: newValue
                                });
                            }
                        });
                        break;
                    }
                    case CHANGE_ITEM_PRICE: {
                        MySwal.fire({
                            title: <Typography component="p" variant="h5">Enter new item price. Must be a number!</Typography>,
                            input: 'number'
                        }).then((result) => {
                            newValue = result.value;

                            if(newValue) {
                                itemCalculatedPrice = newValue * item.itemCalculatedAmount;
                                itemRef.update({
                                    itemInitialPrice: Number(newValue),
                                    itemCalculatedPrice: itemCalculatedPrice
                                });
                            }
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
                                           <Typography component="p" variant="h5">
                                               {item.itemName}
                                           </Typography>
                                           <Typography component="p" variant="subtitle1">
                                               {item.itemCalculatedAmount} x {item.itemInitialPrice} = {item.itemCalculatedPrice}
                                           </Typography>
                                           <Typography component="p" variant="subtitle2">
                                               {item.currentTime}
                                           </Typography>
                                       </div>
                                   </ExpansionPanelSummary>
                                   <ExpansionPanelDetails>
                                       <OrderListButtons>
                                           <Fab children={<AddIcon fontSize="small" />} onClick={() => manipulateItem(item.itemId, INCREMENT)} color="primary" aria-label="Add one item" size='small'/>
                                           <Fab disabled={item.itemCalculatedAmount < 2} children={<RemoveIcon fontSize="small" />} onClick={() => manipulateItem(item.itemId, DECREMENT)} color="secondary" aria-label="Remove one item" size='small' />
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
