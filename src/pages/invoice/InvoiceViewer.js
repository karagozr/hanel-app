/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect } from 'react';
import SplitPane from "react-split-pane";
import {useActionButton} from '../../contexts'
import { InvoiceEdit } from './InvoiceEdit'
import {addActionButton} from '../../contexts/actions'
import {InvoiceModal,FloatActionButton} from '../../components'
import './InvoiceViewer.css'
import { InvoiceDisplay } from './InvoiceDisplay';
import { InvoiceDisplayModal } from './InvoiceDisplayModal';




export const InvoiceViewer = ({ match }) => {
    const [screenSize, setSetScreenSize]=useState(0);
    const [openInvoice, setOpenInvoice]=useState(false);
    const invoivePreview=(e)=>{
        setOpenInvoice(true);
    }

    const buttons = [{icon:'rtffile',label:'Fatura Önizle',clickEvent:invoivePreview}];
    const actionButton = useActionButton();
    
    
    useEffect(()=>{
        if(window.innerWidth <= 1080 )
            actionButton.dispatch(addActionButton(buttons));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    const ett = match.params.ett;
    const inoviceNo = match.params.inoviceNo;
    document.title = inoviceNo;

    
    return (
        
        <React.Fragment>
            
            <FloatActionButton buttons={[{icon:'save',title:'Kaydet',clickEvent:(e)=>console.log('click')}]}/>
            {window.innerWidth > 1080 ? (
            <SplitPane split="vertical" defaultSize='59%' onDragFinished={(e)=>setSetScreenSize(e)} 
                    resizerStyle={{ backgroundColor: 'rgb(225 82 38 / 25%)', width: '5px', cursor: 'col-resize', minWidth: '5px' }}>
                <div>
                <h3 className={'content-block'}>Fatura Aktar</h3>
                <div className={'content-block dx-card responsive-paddings'}>
                    <InvoiceEdit invoiceGuid={ett} />
                </div>
                </div>
                <div>
                {/* <style dangerouslySetInnerHTML={{
                    __html: `
 .iframe-fatura body{
 transform: scale(0.5);
 transform-origin: 0 0; }
                            `}} /> */}
                    <h3 className={'content-block'}>Fatura Önizleme</h3>
                    <div className={'content-block dx-card responsive-paddings'} style={{padding:'5px'}}>
                        {/* <iframe id='iframekey' className={"iframe-fatura"} scrolling="no" frameBorder="0" height={window.innerHeight*0.8} width="100%" 
                        src={`${process.env.REACT_APP_BASE_URL}/Invoice/GetDocument?ett=${ett}&belgeTuru=HTML`} 
                        style={{backgroundColor:'white'}}>
                            <h2>sdasdsad</h2>
                        </iframe> */}
                        <InvoiceDisplay ett={ett} width={screenSize}></InvoiceDisplay>
                    </div>
                </div>
                
                
	      </SplitPane>

        ) : (
            
            <div>
                <InvoiceDisplayModal ett={ett} open={openInvoice} onClose={(e) => setOpenInvoice(false)} />
                <h3 className={'content-block'}>Fatura Aktar</h3>
                <div className={'content-block dx-card responsive-paddings'}>
                    <InvoiceEdit invoiceGuid={ett} />
                </div>
            </div>
        )}
        </React.Fragment>
        
    );
}


