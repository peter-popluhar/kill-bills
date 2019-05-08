import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { orderItemsDatabase,archiveItemsDatabase } from './../utils/fireBaseUtils';
import Fab from '@material-ui/core/Fab';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Archive from '@material-ui/icons/Archive';
import Typography from '@material-ui/core/Typography';
import { OrderOverviewSkeleton, OrderOverviewSkeletonItem } from './styled/orderOverviewStyles'

const OrderOverview = ({user, allItems}) => {

    const clearCurrentBill = () => {

        orderItemsDatabase.orderByChild('user').equalTo(user.email).once('value', function(snapshot){
            let updates = {};

            snapshot.forEach(function(child) {
                updates[child.key] = null;
            });

            orderItemsDatabase.update(updates);
        });
    };

    const archiveCurrentBill = (e) => {
        e.preventDefault();

        let keys = [];

        orderItemsDatabase.orderByChild('user').equalTo(user.email).once('value', function(snapshot){
            snapshot.forEach(function(child) {
                keys.push([child.key]);
            });
        }).then(() => {

            orderItemsDatabase.orderByChild('user').equalTo(user.email).once('value', function(snapshot)  {

                archiveItemsDatabase.update( snapshot.val(), function(error) {

                    if( !error ) {
                        let updates = {};

                        snapshot.forEach(function(child) {
                            updates[child.key] = null;
                        });

                        orderItemsDatabase.update(updates);
                    }
                    else if( typeof(console) !== 'undefined' && console.error ) {
                        console.error(error);
                    }
                });
            }).then(() => {
                // check what to do with old app
            });
        });
    };


    const orderInfo = () => {

        let allItemsCalculatedPrices = [];
        let allOrdersCurrentTime = [];
        let allItemsCalculatedAmount = [];
        let lastOrderName = '';

        allItems.map((item) => {
            allItemsCalculatedPrices.push(item.itemCalculatedPrice);
            allOrdersCurrentTime.push(item.currentTime);
            allItemsCalculatedAmount.push(item.itemCalculatedAmount);
        });

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
            lastOrderName: lastOrderName
        }
    };

    const allItemsCalculatedPrices = orderInfo().allItemsCalculatedPrices;
    const lastOrderCurrentTime = orderInfo().lastOrderCurrentTime;
    const allItemsCalculatedAmount = orderInfo().allItemsCalculatedAmount;
    const lastOrderName = orderInfo().lastOrderName;

    return (
        <OrderOverviewSkeleton>
            { allItems.length > 0 ?

                <>
                    <OrderOverviewSkeletonItem>
                        <Typography component="p" variant="h5" color="inherit">
                            Total: {allItemsCalculatedPrices}
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
        </OrderOverviewSkeleton>

    )

}

const mapStateToProps = (state) => (
    {
        user: state.userReducer.user,
        allItems: state.ordersReducer
    }
);

export default connect(
    mapStateToProps
)(OrderOverview);

OrderOverview.propTypes = {
    allItems: PropTypes.array,
    user: PropTypes.object
};
