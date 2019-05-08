import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

const ModalComponent = () => {

    const [modalState, handleModal] = useState(
        false
    );

    const openModal = () => {
        handleModal(true);
    };

    const closeModal = () => {
        handleModal(false);
    };

    return (
        <div>
            <button onClick={openModal}>Open Modal</button>
            <Modal
                isOpen={modalState}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >

                <h2>Hello</h2>
                <button onClick={closeModal}>close</button>
                {children.props}
            </Modal>
        </div>
    );

}

export default ModalComponent;
