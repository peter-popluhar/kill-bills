import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { capitalize } from 'lodash';
import {connect} from 'react-redux';
import { archiveItemsGroupByIdAction } from './../appAction';
import { databaseRef, ORDER_ITEMS } from './../utils/fireBaseUtils';
import { getOrderDate,getCurrentItemTime } from './../utils/appUtils';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {FormSkeleton, FormSkeletonItem} from './styled/formStyles';
import OrderOverview from './orderOverview';
import Paper from '@material-ui/core/Paper';
import { groupBy } from 'lodash';

const Form = ({user, archive, getArchiveGroupById, archiveGrouped, currency, billLocation}) => {

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
            itemCalculatedAmount: Number(1),
            itemCalculatedPrice: Number(input.itemInitialPrice),
            user: user.email,
            archiveId: Object.keys(archiveGrouped).length + 1,
            billLocation: billLocation ? billLocation : 'Bill Location',
            currency: currency
        };

        databaseRef(ORDER_ITEMS).push(singleBillItem);

        setInputValue({
            itemName: '',
            itemInitialPrice: ''
        })
    };



    useEffect(() => {
        const getArchiveLengthFn = () => {
            getArchiveGroupById(groupBy(archive, 'archiveId'));
        };

        getArchiveLengthFn();
    },[archive, getArchiveGroupById]);

    return (
        <Paper square style={{padding: '24px', margin: '2%'}}>
            <form onSubmit={handleSubmit}>
                <FormSkeleton>
                    <FormSkeletonItem>
                        <TextField
                            name='itemName'
                            label='Item Name'
                            value={input.itemName}
                            onChange={handleChange}
                            variant='standard'
                            type='text'
                            required
                        />
                    </FormSkeletonItem>


                    <FormSkeletonItem>
                        <TextField
                            name='itemInitialPrice'
                            label='Item Price'
                            value={input.itemInitialPrice}
                            onChange={handleChange}
                            variant='standard'
                            type='number'
                            required
                        />
                        <Fab size='medium' color='primary' aria-label='Add' type='submit'>
                            <AddIcon />
                        </Fab>
                    </FormSkeletonItem>
                </FormSkeleton>

            </form>

            <OrderOverview />

        </Paper>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        getArchiveGroupById: (archiveLength) => dispatch(archiveItemsGroupByIdAction(archiveLength))
    }
};

const mapStateToProps = (state) => (
    {
        user: state.userReducer.user,
        archive: state.archiveReducer,
        archiveGrouped: state.archiveGroupByIdReducer,
        currency: state.settingsReducer.currency,
        billLocation: state.locationReducer.billLocation,
    }
);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form);

Form.propTypes = {
    user: PropTypes.object,
    currency: PropTypes.string,
    archive: PropTypes.array,
    getArchiveGroupById: PropTypes.func,
    archiveGrouped: PropTypes.object
};
