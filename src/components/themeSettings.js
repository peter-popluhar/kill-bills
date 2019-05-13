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
import { connect } from 'react-redux';
import { ORDER_ITEMS } from './../utils/fireBaseUtils';

const ThemeSettings = ({user, theme, allItems}) => {


    const handleTheme = (e) => {
        let value = e.target.value;
        firebase.database().ref('settings/theme/' + user.uid).update({theme: value}).then(() => {
            allItems.forEach((item) => {
                let ref = firebase.database().ref(`/${ORDER_ITEMS}/${item.itemId}`);
                ref.update({theme: value})
            })
        });
    }


    return(
        <Paper style={{margin: '2%', padding: '3% 24px'}}>
            <div>
                <FormControl component="fieldset">
                    <FormLabel component="legend">
                        <Typography component="p" variant="subtitle1">
                            Theme is: {theme}
                        </Typography>
                    </FormLabel>

                    <RadioGroup
                        aria-label="Theme"
                        name="theme"
                        value={theme}
                        onChange={handleTheme}
                    >
                        <FormControlLabel value="Light" control={<Radio color="primary" checked={theme === "Light"}/>} label="Light" />
                        <FormControlLabel value="Dark" control={<Radio color="primary" checked={theme === "Dark"} />} label="Dark" />
                    </RadioGroup>
                </FormControl>
            </div>
        </Paper>
    )

}

const mapStateToProps = (state) => (
    {
        user: state.userReducer.user,
        theme: state.settingsReducer.theme,
        allItems: state.ordersReducer
    }
);

export default connect(
    mapStateToProps
)(ThemeSettings);

ThemeSettings.propTypes = {
    theme: PropTypes.string,
    user: PropTypes.object,
    allItems: PropTypes.array
};
