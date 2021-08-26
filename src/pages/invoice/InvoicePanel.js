import React from 'react'
import { useHistory } from "react-router-dom";
import InvoiceList from './InvoiceList'
import {YevmiyeFisModal}  from '../../components';
import { InvoiceDisplayModal }  from './InvoiceDisplayModal';
import { confirm } from 'devextreme/ui/dialog';
import { useInvoice } from '../../contexts/hooks';

export const InvoicePanel=React.memo(()=>{
    const invoiceModalRef=React.useRef(null);
    const history = useHistory();
    const invoice = useInvoice();

    const [yevmiyeFisOpen, setYevmiyeFisOpen] = React.useState(false);
    const [openInvoice, setOpenInvoice]=React.useState({open:false, ett:''});
    const [yevmiyeFisData, setYevmiyeFisData] = React.useState([]);
   
    

    const onInvoiceClick=React.useCallback((e)=>{
        history.push('/invoice/view/' + e.data.guid + '/' + e.data.faturaNo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const onRowMenuClick = React.useCallback((e,data) => {
        if(e.itemData.id===1){
            setOpenInvoice({open:true, ett:data.guid, invoiceNo:data.faturaNo});
        }else if(e.itemData.id===3){
            invoice.getYevmiyeFisi(data.faturaNo,data.cariKodu).then((result)=>{
            
                setYevmiyeFisData(result);
                setYevmiyeFisOpen(true);
                
            }).catch((error)=>{
                confirm(error,"Hata");
                return;
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    const downloadYevmiyeFisi = React.useCallback(async (invoiceNo, cariKodu) => {
        await invoice.saveYevmiyeFisi(invoiceNo,cariKodu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

   
    return(
        <div>
           
            <InvoiceDisplayModal modalRef={invoiceModalRef} ett={openInvoice.ett} invoiceNo={openInvoice.invoiceNo} open={openInvoice.open} onClose={(e) => setOpenInvoice(false)} />
            <YevmiyeFisModal data={yevmiyeFisData} open = {yevmiyeFisOpen} onClose={(e) => setYevmiyeFisOpen(false)} downloadYevmiyeFisi={downloadYevmiyeFisi}/>
            <InvoiceList onInvoiceClick={onInvoiceClick} onRowMenuClick={onRowMenuClick} />
        </div>
    )    
})




