import React, { Component } from 'react';

class ArchiveList extends Component {

    render() {

        return(
            <ul>
                {Object.keys(this.props.allArchivedItemsSortedByArchiveId).map((v,i) => {
                    return (
                        <li key={i}>
                            {this.props.allArchivedItemsSortedByArchiveId[v].map((vv, ii) => {
                                return(
                                    <span key={ii}>
                                        <h2>{vv.itemNewAmount} x {vv.itemName} = {vv.itemNewPrice}</h2>
                                    </span>
                                )
                            })}
                        </li>
                    )
                })}
            </ul>
        )

    }
}

export default ArchiveList;
