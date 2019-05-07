import React from 'react';
import {connect} from 'react-redux';
import { orderItemsDatabase,archiveItemsDatabase } from './../utils/fireBaseUtils';
import Fab from '@material-ui/core/Fab';
import DeleteForever from '@material-ui/icons/DeleteForever';
import Archive from '@material-ui/icons/Archive';
import Typography from '@material-ui/core/Typography';
import { OrderOverviewSkeleton, OrderOverviewSkeletonItem } from './orderOverviewStyles'

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

    const totalBillPrice = () => {
        let allItemsNewPrices = [];
        allItems.map((v) => {
            allItemsNewPrices.push(v.itemNewPrice);
            return allItemsNewPrices
        });
        return allItemsNewPrices.reduce((a, b) => a + b, 0)
    }

    return (
        <OrderOverviewSkeleton>
            { allItems.length > 0 ?

                <>
                    <OrderOverviewSkeletonItem>
                        <p>total: {totalBillPrice()}</p>
                    </OrderOverviewSkeletonItem>
                    <OrderOverviewSkeletonItem>
                        <Fab size='small' color='secondary' aria-label='delete current orders' onClick={clearCurrentBill}>
                            <DeleteForever />
                        </Fab>
                        <Fab size='small' color='primary' aria-label='Add' onClick={archiveCurrentBill}>
                            <Archive />
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
