import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { groupBy } from 'lodash';
import {archiveItemsDatabase, ORDER_ITEMS} from './../utils/fireBaseUtils';
import Fab from '@material-ui/core/Fab';
import DeleteForever from '@material-ui/icons/DeleteForever';
import firebase from '../firebase';

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

    return(
        <>
            {sortedByArchiveId &&
                <ul>
                    {Object.keys(sortedByArchiveId).map((v, i) => {
                        return (
                            <li key={i}>
                                {sortedByArchiveId[v].map((vv, ii) => {
                                    return (
                                        <span key={ii}>
                                            <h2>{vv.itemNewAmount} x {vv.itemName} = {vv.itemNewPrice}</h2>
                                        </span>
                                    )
                                })}
                            </li>
                        )
                    })}
                </ul>
            }
        <Fab size='small' color='secondary' aria-label='clear archive orders' onClick={clearArchive}>
            <DeleteForever />
        </Fab>

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
