/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useState, useEffect, useRef } from 'react';
import { Popup } from 'devextreme-react/popup';
import { HtmlViewer } from '../../components'
import { useInvoice } from '../../contexts/hooks'
import './InvoiceDisplayModal.css'

export const InvoiceDisplayModal = ({ open, ett, onClose, modalRef,invoiceNo }) => {
    const printPage = useRef();
    const invoice = useInvoice();
    const [htmlData, setHtmlData] = useState('');


    const printIframe = (e) => {
        const iframe = document.frames
            ? document.frames['htmlViewerIframe']
            : document.getElementById('htmlViewerIframe');
        const iframeWindow = iframe.contentWindow || iframe;

        iframe.focus();
        iframeWindow.print();

        return false;
    };


    useEffect(() => {
        if (open === true && ett !== '') {

            invoice.getInvoiceRawHtml(ett).then((data) => {
                setHtmlData(data);
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const downloadInvoice = async () => {
        await invoice.saveInvoiceDocument(ett,invoiceNo);
    }

    return (
        <Popup
            className='invoiceModal'
            visible={open}
            ref={modalRef}
            onHiding={onClose}
            dragEnabled={true}
            closeOnOutsideClick={false}
            showTitle={true}
            defaultWidth={window.innerWidth > 1000 ? 800 : window.innerWidth * 0.95}
            defaultHeight={window.innerHeight * 0.95}
            resizeEnabled={true}
            title="Fatura Önizle"
            toolbarItems={
                [{
                    location: 'before',
                    widget: 'dxButton',
                    options: {
                        stylingMode: 'text',
                        icon: "print",
                        text: "Yazdır",
                        onClick: printIframe
                    }
                }, {
                    location: 'before',
                    widget: 'dxButton',
                    options: {
                        stylingMode: 'text',
                        icon: "exportpdf",
                        text: "Pdf",
                        onClick: downloadInvoice
                    }
                }]}
            showCloseButton={true}>
            <HtmlViewer ref={printPage} data={htmlData} width={300} height={'100%'} />
        </Popup>

    );
}
