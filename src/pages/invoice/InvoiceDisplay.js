/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect } from 'react';
import { HtmlViewer } from '../../components'
import { useInvoice } from '../../contexts/hooks'

export const InvoiceDisplay = ({ ett,width }) => {
    const invoice = useInvoice();
    const [htmlData, setHtmlData]=useState('');
    
    useEffect(()=>{
        invoice.getInvoiceRawHtml(ett).then((data)=>{
            setHtmlData(data);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ett])
    
    return (<HtmlViewer data={htmlData} width={width} height={790}/>);
}


