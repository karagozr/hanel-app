/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect, useRef } from 'react';
import List from 'devextreme-react/list';
import { Popup } from 'devextreme-react/popup';
import TextArea from 'devextreme-react/text-area';
import './InvoiceDisplayModal.css'


const noteRender = (data) => {
    return( 
        <div>
            <div>{data.createDate}  - <strong>{data.userName}</strong> </div>
            <p style={{wordBreak: "break-all" }}>{data.note}</p>
        </div>)
}

export const InvoiceAttachNoteModal = React.memo(({ open, onClose, notes=[], invoiceId, saveNote }) => {
    const refTextArea = useRef(null);
    const [note, setNote] = useState('');

    React.useEffect(()=>{
        if(!open){
            setNote('')
        }
    },[open])

    let compHeight=window.innerHeight * 0.60;
    
    return (
        <Popup
            className='invoiceModal'
            visible={open}
            onHiding={onClose}
            dragEnabled={true}
            closeOnOutsideClick={false}
            showTitle={true}
            defaultWidth={window.innerWidth > 1000 ? 400 : window.innerWidth * 0.95}
            defaultHeight={compHeight}
            resizeEnabled={true}
            title="Fatura Not İliştir ve Listele"
            showCloseButton={true}toolbarItems={
                [{
                  toolbar:'bottom',
                  location: 'before',
                  widget: 'dxButton',
                  options: {
                      stylingMode:'text',
                      icon:"save",
                      text:"Kaydet ve Kapat",
                      onClick:e=>saveNote(note)
                  }
                }
              ]}>
            
            <div style={{margin:10}}>
            <TextArea ref={refTextArea} height={(compHeight-110)/5}  defaultValue={note} value={note} onValueChanged={({value})=>setNote(value)} />
            
            
            <List selectionMode="single" dataSource={notes} height={4*(compHeight-110)/5} itemRender={noteRender}  onSelectionChanged={({addedItems})=>setNote(addedItems[0].note)}/>

            </div>

        </Popup>

    );
})

