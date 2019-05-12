import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import firebase from './../firebase.js';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {connect} from 'react-redux';

const CurencySettings = ({user, currency}) => {


    const handleCurrency = (e) => {
        firebase.database().ref('settings/currency/' + user.uid).update({currency: e.target.value})
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
        currency: state.settingsReducer.currency
    }
);

export default connect(
    mapStateToProps
)(CurencySettings);

CurencySettings.propTypes = {
    currency: PropTypes.string,
    user: PropTypes.object
};
