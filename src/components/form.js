import React, { useState, useReducer } from 'react';
import firebase from './../firebase.js';
import { capitalize } from 'lodash';
import {connect} from 'react-redux';
import {itemsDatabase,archiveDatabase,getOrderDate,getCurrentItemTime} from './../utils';

const Form = ({user}) => {

    const [input, setInputValue] = useReducer(
        (state, newState) => ({...state, ...newState}),
        {
            itemName: '',
            itemInitialPrice: ''
        }
    );

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

        itemsDatabase.push(singleBillItem);

        setInputValue({
            itemName: '',
            itemInitialPrice: ''
        })
    };

    const clearCurrentBill = () => {

        itemsDatabase.orderByChild('user').equalTo(user.email).once('value', function(snapshot){
            let updates = {};

            snapshot.forEach(function(child) {
                updates[child.key] = null;
            });

            itemsDatabase.update(updates);
        });
    };

    const archiveCurrentBill = (e) => {
        e.preventDefault();

        let keys = [];

        itemsDatabase.orderByChild('user').equalTo(user.email).once('value', function(snapshot){
            snapshot.forEach(function(child) {
                keys.push([child.key]);
            });
        }).then(() => {

            itemsDatabase.orderByChild('user').equalTo(user.email).once('value', function(snapshot)  {

                archiveDatabase.update( snapshot.val(), function(error) {

                    if( !error ) {
                        let updates = {};

                        snapshot.forEach(function(child) {
                            updates[child.key] = null;
                        });

                        itemsDatabase.update(updates);
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

        archiveDatabase.orderByChild('user').equalTo(user.email).once('value', function(snapshot){
            let updates = {};

            snapshot.forEach(function(child) {
                updates[child.key] = null;
            });

            archiveDatabase.update(updates);
        });
    };

    return (
        <div className="form">form:
            <form onSubmit={handleSubmit}>
                <input type="text" name="itemName" onChange={handleChange} value={input.itemName} />
                <input type="number" name="itemInitialPrice" onChange={handleChange} value={input.itemInitialPrice} />
                <input type="submit"/>
            </form>
            <button onClick={clearCurrentBill}>delete</button>
            <button onClick={archiveCurrentBill}>archive</button>
            <button onClick={clearArchive}>clear archive</button>
        </div>
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
