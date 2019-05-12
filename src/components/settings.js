import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {connect} from 'react-redux';

const Settings = ({currency, theme}) => {
    const [currencyValue, setCurrency] = React.useState('czk');

    const handleCurrency = (e) => {
        setCurrency(e.target.value);
    }


    return(
        <>
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
                            value={currencyValue}
                            onChange={handleCurrency}
                        >
                            <FormControlLabel value="czk" control={<Radio color="primary" />} label="CZK" />
                            <FormControlLabel value="eur" control={<Radio color="primary" />} label="EUR" />
                        </RadioGroup>
                    </FormControl>
                </div>
            </Paper>
        </>
    )

}

const mapStateToProps = (state) => (
{
    currency: state.settingsReducer.currency,
    theme: state.settingsReducer.theme
}
);

export default connect(
    mapStateToProps
)(Settings);

Settings.propTypes = {

};
