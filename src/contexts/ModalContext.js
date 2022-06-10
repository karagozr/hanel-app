import React, { useState, createContext, useContext, useEffect } from 'react';

const ModalContext = createContext({});
// const useFilterArea = () => useContext(FilterAreaContext);

const useModal = () => {
    const {modalData,setModalData} = React.useContext(ModalContext);

    const isOpen = (modalId) => modalData.open && (modalId===modalData.modalId);

    const closeModal = () => setModalData({open:false}) 

    const openModal = (modalId,data) => {
        console.log("modalId : ",modalId)
        setModalData({open:true,modalId:modalId,data}) }
    
    const getData = () => modalData.data

    return {
        isOpen,
        closeModal,
        openModal,
        getData
    }
}

const ModalProvider = (props) => {
    
    const [modalData, setModalData] = useState({});

    return ( <ModalContext.Provider value={{ modalData, setModalData }} {...props} />  );
}


export {
    ModalProvider,
    useModal
}
