import React, { Component } from 'react';
import firebase from './../firebase.js';
import { capitalize } from 'lodash';
import {connect} from 'react-redux';

let itemsDatabase = firebase.database().ref('orderItems');
let archiveDatabase = firebase.database().ref('archive');

class Form extends Component {
    state = {
        itemName: '',
        itemInitialPrice: '',
        itemNewPrice: ''
    };

    handleChange = (e) => this.setState({[e.target.name]: e.target.value});

    handleSubmit = (e) => {
        e.preventDefault();

        const singleBillItem = {
            itemName: capitalize(this.state.itemName),
            itemInitialPrice: Number(this.state.itemInitialPrice),
            user: this.props.user.email,
            itemNewPrice: Number(this.state.itemInitialPrice)
        };

        itemsDatabase.push(singleBillItem);

        this.setState({
            itemName: '',
            itemInitialPrice: ''
        });
    };

    clearCurrentBill = () => {

        itemsDatabase.orderByChild('user').equalTo(this.props.user.email).once('value', function(snapshot){
            let updates = {};

            snapshot.forEach(function(child) {
                updates[child.key] = null;
            });

            itemsDatabase.update(updates);
        });
    };

    archiveCurrentBill = (e) => {
        e.preventDefault();

        let keys = [];

        itemsDatabase.orderByChild('user').equalTo(this.props.user.email).once('value', function(snapshot){
            snapshot.forEach(function(child) {
                keys.push([child.key]);
            });
        }).then(() => {

            itemsDatabase.orderByChild('user').equalTo(this.props.user.email).once('value', function(snapshot)  {

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

    clearArchive = () => {

        archiveDatabase.orderByChild('user').equalTo(this.props.user.email).once('value', function(snapshot){
            let updates = {};

            snapshot.forEach(function(child) {
                updates[child.key] = null;
            });

            archiveDatabase.update(updates);
        });
    };

    render() {
        const {itemName, itemInitialPrice} = this.state;
        return (
            <div className="form">form:
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="itemName" onChange={this.handleChange} value={itemName} />
                    <input type="number" name="itemInitialPrice" onChange={this.handleChange} value={itemInitialPrice} />
                    <input type="submit"/>
                </form>
                <button onClick={this.clearCurrentBill}>delete</button>
                <button onClick={this.archiveCurrentBill}>archive</button>
                <button onClick={this.clearArchive}>clear archive</button>
            </div>
        )
    }
}

const mapStateToProps = (state) => (
    {
        user: state.userReducer.user
    }
);

export default connect(
    mapStateToProps
)(Form);
