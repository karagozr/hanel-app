/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect,useRef } from 'react';
import { Popup } from 'devextreme-react/popup';
import { HtmlViewer } from '../../components'
import { useInvoice } from '../../contexts/hooks'
import './InvoiceDisplayModal.css'

export const DenemeModal= React.memo(({open,ett,onClose,url}) => {
    const modal = useRef();
    
    return (
        <Popup
        className='invoiceModal'
          visible={open}
          ref={modal}
          onHiding={onClose}
          dragEnabled={true}
          closeOnOutsideClick={false}
          showTitle={true}
          resizeEnabled={true}
          style={{padding:'5px'}}
          title="Fatura Önizle"
          showCloseButton={true}>
              <div>
                
              </div>
        </Popup>
        
    );
})
