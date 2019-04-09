import React from 'react';

const Form = ({handleSubmit, handleChange, itemName, itemInitialPrice}) => (

    <div className="form">form:
        <form onSubmit={handleSubmit}>
            <input type="text" name="itemName" onChange={handleChange} value={itemName} />
            <input type="number" name="itemInitialPrice"  onChange={handleChange} value={itemInitialPrice} />
            <input type="submit"/>
        </form>
        <button>archive</button>
        <button>delete</button>
    </div>
);

export default Form;
