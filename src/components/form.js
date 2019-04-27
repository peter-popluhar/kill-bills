import React, { useReducer, useState } from 'react';
import { capitalize } from 'lodash';
import {connect} from 'react-redux';
import { orderItemsDatabase,archiveItemsDatabase } from './../utils/fireBaseUtils';
import { getOrderDate,getCurrentItemTime } from './../utils/appUtils';

const Form = ({user}) => {

    const [input, setInputValue] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            itemName: '',
            itemInitialPrice: ''
        }
    );

    const [archive, setArchive] = useState({
        archiveId: null,
        archiveItemsLength: 0,
        archivedItemsSortedByArchiveId: []
    });

    const { archiveId, archiveItemsLength } = archive;

    const handleChange = e => {
        setInputValue({[e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const singleBillItem = {
            currentDate: getOrderDate(),
            currentTime: getCurrentItemTime(),
            itemInitialAmount: Number(1),
            itemInitialPrice: Number(input.itemInitialPrice),
            itemName: capitalize(input.itemName),
            itemNewAmount: Number(1),
            itemNewPrice: Number(input.itemInitialPrice),
            user: user.email
        };

        if( !archiveId ) {
            singleBillItem.archiveId = archiveItemsLength + 1;
            setArchive({archiveId: singleBillItem.archiveId});
        } else {
            singleBillItem.archiveId = archiveId
        }

        orderItemsDatabase.push(singleBillItem);

        setInputValue({
            itemName: '',
            itemInitialPrice: ''
        })
    };

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

            });
        });
    };

    const clearArchive = () => {

        archiveItemsDatabase.orderByChild('user').equalTo(user.email).once('value', function(snapshot){
            let updates = {};

            snapshot.forEach(function(child) {
                updates[child.key] = null;
            });

            archiveItemsDatabase.update(updates);
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input type="text" name="itemName" onChange={handleChange} value={input.itemName} />
                <input type="number" name="itemInitialPrice" onChange={handleChange} value={input.itemInitialPrice} />
                <input type="submit"/>
            </form>
            <button onClick={clearCurrentBill}>delete</button>
            <button onClick={archiveCurrentBill}>archive</button>
            <button onClick={clearArchive}>clear archive</button>
        </>
    )

}

const mapStateToProps = (state) => (
    {
        user: state.userReducer.user
    }
);

export default connect(
    mapStateToProps
)(Form);
