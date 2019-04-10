import React, { Component } from 'react';
import firebase from './../firebase.js';
import { capitalize } from 'lodash';

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

        firebase.database().ref('orderItems').push(singleBillItem);

        this.setState({
            itemName: '',
            itemInitialPrice: ''
        });
    };

    clearCurrentBill = () => {
        let ref = firebase.database().ref('orderItems')

        ref.orderByChild('user').equalTo(this.props.user.email).once('value', function(snapshot){
            let updates = {};

            snapshot.forEach(function(child) {
                updates[child.key] = null;
            });

            ref.update(updates);
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
            </div>
        )
    }
}

export default Form;
