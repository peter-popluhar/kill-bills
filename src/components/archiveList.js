import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { groupBy } from 'lodash';
import {archiveItemsDatabase, ORDER_ITEMS} from './../utils/fireBaseUtils';
import Fab from '@material-ui/core/Fab';
import DeleteForever from '@material-ui/icons/DeleteForever';
import firebase from '../firebase';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const ArchiveList = ({archiveItems, allItems, user}) => {

    const clearArchive = () => {

        archiveItemsDatabase.orderByChild('user').equalTo(user.email).once('value', function(snapshot){
            let updates = {};

            snapshot.forEach(function(child) {
                updates[child.key] = null;
            });

            archiveItemsDatabase.update(updates);
        });

        clearOrdersArchiveId()
    };

    const clearOrdersArchiveId = () => {

        allItems.forEach((item) => {
            let ref = firebase.database().ref(`/${ORDER_ITEMS}/${item.itemId}`);
           ref.update({archiveId: 1})
        })
    }

    let sortedByArchiveId = groupBy(archiveItems, 'archiveId');
    let totalBillPrice;
    let billDate;
    let billLocation;

    return(
        <>
            {Object.keys(sortedByArchiveId).length > 0 ?

                <>
                    {Object.keys(sortedByArchiveId).map((v, i) => {
                        return (
                            <Paper key={i} square style={{margin: '2%', padding: '3% 24px', display: 'flex', flexDirection: 'column-reverse'}}>
                                <div>
                                    {sortedByArchiveId[v].map((vv, ii) => {
                                        totalBillPrice = vv.totalPrice;
                                        billDate = vv.currentDate;
                                        billLocation = vv.billLocation;
                                        return (
                                            <Typography key={ii} component="p" variant="subtitle1">
                                                {vv.itemCalculatedAmount} x {vv.itemName} = {vv.itemCalculatedPrice}
                                            </Typography>
                                        )
                                    })}
                                    <Typography component="p" variant="subtitle1">
                                        Location: {billLocation}
                                    </Typography>
                                    <Typography component="p" variant="subtitle1">
                                        total: {totalBillPrice}
                                    </Typography>
                                </div>
                                <div>
                                    <Typography component="p" variant="subtitle1">
                                        {billDate}
                                    </Typography>
                                </div>
                            </Paper>
                        )
                    })}
                    <div style={{padding: '3% 24px', textAlign: 'center'}}>
                        <Fab size='small' color='secondary' aria-label='clear archive orders' onClick={clearArchive}>
                            <DeleteForever />
                        </Fab>
                    </div>
                </> :

                <Paper square style={{margin: '2%', padding: '3% 24px', textAlign: 'center'}}>
                    <Typography component="p" variant="subtitle1">
                        Archive is empty
                    </Typography>
                </Paper>
            }
        </>
    )

}

const mapStateToProps = (state) => {
    return {
        allItems: state.ordersReducer,
        archiveItems: state.archiveReducer,
        user: state.userReducer.user
    }
};

export default connect(
    mapStateToProps
)(ArchiveList);

ArchiveList.propTypes = {
    archiveItems: PropTypes.array,
    user: PropTypes.object
};
