import React, { Component, useState, useEffect } from 'react';
import {connect} from 'react-redux';
import {ARCHIVE} from './../utils';
import { groupBy } from 'lodash';

const ArchiveList = ({allItems}) => {

    let sortedByArchiveId = groupBy(allItems, 'archiveId');

    return(
        <>
            {sortedByArchiveId &&
                <ul>
                    {Object.keys(sortedByArchiveId).map((v, i) => {
                        return (
                            <li key={i}>
                                {sortedByArchiveId[v].map((vv, ii) => {
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
        allItems: state.archiveReducer
    }
};

export default connect(
    mapStateToProps
)(ArchiveList);
