import React from 'react'
import PropTypes from 'prop-types'
import { Popup } from 'devextreme-react'
import { useModal } from '../../contexts'


export const BaseModal = ({modalId,title,children}) => {
    const modal = useModal();
    return (
        <Popup
            className='base-modal'
            visible={modal.isOpen(modalId)}
            // ref={modalRef}
            onHiding={e=>modal.closeModal()}
            dragEnabled={true}
            closeOnOutsideClick={false}
            showCloseButton={true}
            showTitle={true}
            //defaultWidth={window.innerWidth > 1000 ? 800 : window.innerWidth * 0.95}
            defaultHeight={window.innerHeight * 0.9}
            resizeEnabled={true}
            title={title?title:"Base Modal"}>
                {children}
        </Popup>
  )
}

BaseModal.propTypes = {}

