import React, { Component } from 'react';
import {connect} from 'react-redux';
import {ARCHIVE} from './../utils';

const ArchiveList = ({allItems}) => {

    console.log(allItems)

    return(
        <>
            {allItems &&
                <ul>
                    {Object.keys(allItems).map((v, i) => {
                        return (
                            <li key={i}>
                                {allItems[v].map((vv, ii) => {
                                    return (
                                        <span key={ii}>
                                            <h2>{vv.itemNewAmount} x {vv.itemName} = {vv.itemNewPrice}</h2>
                                        </span>
                                    )
                                })}
                            </li>
                        )
                    })}
                </ul>
            }
        </>
    )

}

const mapStateToProps = (state) => {
    return {
        allItems: state.archiveReducer.payload
    }
};

export default connect(
    mapStateToProps
)(ArchiveList);
