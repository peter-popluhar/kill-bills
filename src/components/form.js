import React, { useReducer, useState } from 'react';
import { capitalize } from 'lodash';
import {connect} from 'react-redux';
import { orderItemsDatabase } from './../utils/fireBaseUtils';
import { getOrderDate,getCurrentItemTime } from './../utils/appUtils';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {FormSkeleton, FormSkeletonItem} from './formStyles';
import OrderOverview from './orderOverview';
import Paper from '@material-ui/core/Paper';

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

    return (
        <Paper square style={{padding: '3%', margin: '2%'}}>
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
                        />
                        <Fab size='small' color='primary' aria-label='Add' type='submit'>
                            <AddIcon />
                        </Fab>
                    </FormSkeletonItem>


                </FormSkeleton>

            </form>

            <OrderOverview />

        </Paper>
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
