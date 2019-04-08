import React from 'react';

const List = (props) => (
    <>
        <p>List:</p>
    <ul>
        {props.children}
    </ul>

    </>
);

export default List;
