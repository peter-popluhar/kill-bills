import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { databaseRef,  ORDER_ITEMS, ARCHIVE } from './../utils/fireBaseUtils';
import Fab from '@material-ui/core/Fab';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Archive from '@material-ui/icons/Archive';
import Typography from '@material-ui/core/Typography';
import { OrderOverviewSkeleton, OrderOverviewSkeletonItem } from './styled/orderOverviewStyles'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import TouchApp from '@material-ui/icons/TouchApp';
import {locationAction} from './../appAction';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const OrderOverview = ({user, allItems, currency, getLocation}) => {

    const MySwal = withReactContent(Swal);

    const [open, setOpen] = useState(false);

    const clearCurrentBill = () => {
        let updates = {};
        databaseRef(ORDER_ITEMS).orderByChild('user').equalTo(user.email).once('value', function(snapshot){
            snapshot.forEach(function(child) {
                updates[child.key] = null;
            });
        }).then(() => {
            databaseRef(ORDER_ITEMS).update(updates);
            getLocation('')
        });
    };

    const archiveCurrentBill = (e) => {
        e.preventDefault();

        let keys = [];

        databaseRef(ORDER_ITEMS).orderByChild('user').equalTo(user.email).once('value', function(snapshot){
            snapshot.forEach(function(child) {
                keys.push([child.key]);
            });
        }).then(() => {

            databaseRef(ORDER_ITEMS).orderByChild('user').equalTo(user.email).once('value', function(snapshot)  {

                databaseRef(ARCHIVE).update( snapshot.val(), function(error) {

                    if( !error ) {
                        let updates = {};

                        snapshot.forEach(function(child) {
                            updates[child.key] = null;
                        });

                        databaseRef(ORDER_ITEMS).update(updates);
                        sendTotalPrice();
                    }
                    else if( typeof(console) !== 'undefined' && console.error ) {
                        console.error(error);
                    }
                });
            }).then(() => {
                setOpen(true);
                setTimeout(() => {
                    setOpen(false)
                },1500)
                getLocation('')
            });
        });
    };


    const orderInfo = () => {

        let allItemsCalculatedPrices = [];
        let allOrdersCurrentTime = [];
        let allItemsCalculatedAmount = [];
        let lastOrderName = '';
        let billLocations = [];

        allItems.forEach((item) => {
            allItemsCalculatedPrices.push(item.itemCalculatedPrice);
            allOrdersCurrentTime.push(item.currentTime);
            allItemsCalculatedAmount.push(item.itemCalculatedAmount);
            billLocations.push(item.billLocation);
        });

        let billLocation = billLocations[0];

        let allOrdersCurrentTimeSortedByTime = allOrdersCurrentTime.sort((a, b) => {
            return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
        });

        let lastOrderCurrentTime = allOrdersCurrentTimeSortedByTime[allOrdersCurrentTimeSortedByTime.length - 1];


        allItems.map((item) => {

            if(lastOrderCurrentTime === item.currentTime) {
                lastOrderName = item.itemName;
            }
            return lastOrderName
        });

        return {
            allItemsCalculatedPrices: allItemsCalculatedPrices.reduce((a, b) => a + b, 0),
            lastOrderCurrentTime: lastOrderCurrentTime,
            allItemsCalculatedAmount: allItemsCalculatedAmount.reduce((a, b) => a + b, 0),
            lastOrderName: lastOrderName,
            billLocation: billLocation
        }
    };

    const allItemsCalculatedPrices = orderInfo().allItemsCalculatedPrices;
    const lastOrderCurrentTime = orderInfo().lastOrderCurrentTime;
    const allItemsCalculatedAmount = orderInfo().allItemsCalculatedAmount;
    const lastOrderName = orderInfo().lastOrderName;
    const billLocation = orderInfo().billLocation;

    const sendTotalPrice = () => {

        allItems.forEach((item) => {
            databaseRef(`/${ARCHIVE}/${item.itemId}`).update({totalPrice: allItemsCalculatedPrices})
        })
    }

    const setBillLocation = () => {
        let newValue;

        MySwal.fire({
            title: <Typography component="p" variant="h5">Enter location:</Typography>,
            input: 'text'
        }).then((result) => {
            newValue = result.value;

            if(newValue) {
                allItems.forEach((item) => {
                    databaseRef(`/${ORDER_ITEMS}/${item.itemId}`).update({billLocation: newValue})
                })
            }
        });
    }

    return (
        <OrderOverviewSkeleton>
            { allItems.length > 0 ?

                <>
                    <OrderOverviewSkeletonItem>
                        <Typography component="p" variant="h5" color="inherit" onClick={setBillLocation}>
                            {billLocation} <TouchApp />
                        </Typography>
                        <Typography component="p" variant="h6" color="inherit" style={{fontWeight: '400'}}>
                            Total: {allItemsCalculatedPrices} {currency}
                        </Typography>
                        <Typography component="p" variant="subtitle1" color="inherit">
                            Items: {allItemsCalculatedAmount}
                        </Typography>
                        <Typography component="p" variant="subtitle1" color="inherit">
                            Last order: {lastOrderName} at {lastOrderCurrentTime}
                        </Typography>
                    </OrderOverviewSkeletonItem>
                    <OrderOverviewSkeletonItem>
                        <Fab size='medium' color='primary' aria-label='Add' onClick={archiveCurrentBill}>
                            <Archive />
                        </Fab>
                        <Fab size='medium' color='secondary' aria-label='delete current orders' onClick={clearCurrentBill}>
                            <DeleteForever />
                        </Fab>
                    </OrderOverviewSkeletonItem>
                </>
                :
                <Typography component="h3" color="inherit">Enter some item&#x24;</Typography>
            }
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    <Typography component="p" variant="subtitle1">
                        Bill was added to Archive
                    </Typography>
                </DialogTitle>
            </Dialog>
        </OrderOverviewSkeleton>

    )

}

const mapDispatchToProps = (dispatch) => {
    return {
        getLocation: (location) => dispatch(locationAction(location))
    }
}

const mapStateToProps = (state) => (
    {
        user: state.userReducer.user,
        allItems: state.ordersReducer,
        currency: state.settingsReducer.currency
    }
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrderOverview);

OrderOverview.propTypes = {
    allItems: PropTypes.array,
    user: PropTypes.object,
    currency: PropTypes.string
};
