/* eslint-disable jsx-a11y/iframe-has-title */
import React,{useRef} from 'react';
import { Popup } from 'devextreme-react/popup';



export const InvoiceModal=({open,onClose,url}) => {
    const modal = useRef();
    
    return (
        <Popup
          visible={open}
          ref={modal}
          onHiding={onClose}
          dragEnabled={true}
          closeOnOutsideClick={false}
          showTitle={true}
          resizeEnabled={true}
          title="Fatura Önizle"
          showCloseButton={true}>
            <iframe key={"saddddh"} height="100%" width="100%" src={url} style={{backgroundColor:'white'}} />
            
        </Popup>
        
    );
}
