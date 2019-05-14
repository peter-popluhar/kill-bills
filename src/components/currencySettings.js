import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { connect } from 'react-redux';
import {databaseRef, ORDER_ITEMS } from './../utils/fireBaseUtils';

const CurencySettings = ({user, currency, allItems}) => {


    const handleCurrency = (e) => {
        let value = e.target.value;
        databaseRef('settings/currency/' + user.uid).update({currency: value}).then(() => {
            allItems.forEach((item) => {
                databaseRef(`/${ORDER_ITEMS}/${item.itemId}`).update({currency: value})
            })
        });
    }

    return(
        <Paper style={{margin: '2%', padding: '3% 24px'}}>
            <div>
                <FormControl component="fieldset">
                    <FormLabel component="legend">
                        <Typography component="p" variant="subtitle1">
                            Currency is: {currency}
                        </Typography>
                    </FormLabel>

                    <RadioGroup
                        aria-label="Currency"
                        name="currency"
                        value={currency}
                        onChange={handleCurrency}
                    >
                        <FormControlLabel value="CZK" control={<Radio color="primary" checked={currency === "CZK"}/>} label="CZK" />
                        <FormControlLabel value="EUR" control={<Radio color="primary" checked={currency === "EUR"} />} label="EUR" />
                    </RadioGroup>
                </FormControl>
            </div>
        </Paper>
    )

}

const mapStateToProps = (state) => (
    {
        user: state.userReducer.user,
        currency: state.settingsReducer.currency,
        allItems: state.ordersReducer
    }
);

export default connect(
    mapStateToProps
)(CurencySettings);

CurencySettings.propTypes = {
    currency: PropTypes.string,
    user: PropTypes.object,
    allItems: PropTypes.array
};
