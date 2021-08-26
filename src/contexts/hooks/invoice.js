import {useApi} from '../AppContext'
import { saveAs } from 'file-saver';

export const useInvoice = () => {
    const api =useApi();

    const getInvoiceRawHtml = async (_ett) => {
        var result = await api.get('/Invoice/GetDocument',{ett:_ett,belgeTuru:'HTML',isString:true});

        return result.data;
    }

    const getInvoice = async (_ett) => {
        var result = await api.get('/Invoice/GetInvoice',{ett:_ett});

        return result.data;
    }
    const getYevmiyeFisi = async (_faturaNo,_cariKodu) => {
        var result = await api.get('/Invoice/GetYevmiyeFisi',{faturaNo:_faturaNo, cariKodu:_cariKodu});
        return result.data;
    }
    const getInvoiceList = async (filter) => {
         var result = await api.post('/invoice/list',filter);
         return result.data;
    }

    const saveInvice = async (data) => {
        var result = await api.post('/Invoice/SaveInvoice',data);

        return result;
    }

    const attachNote = async (invoiceId, notes) => {
        console.log('---- ',invoiceId, notes)
        var updateData = [{ op: "replace", path: "defaultNote", value: notes[0].note},{ op: "replace", path: "userNotes", value: JSON.stringify(notes)}]
        console.log("updateData", updateData)
        var result = await api.patch('/Invoice/Update/'+invoiceId, updateData);

        return result;
    }

    const saveYevmiyeFisi = async (faturaNo, cariKodu) => {
        api.downloadGet('/Invoice/GetInvoicePreview',{faturaNo, cariKodu}).then(({data})=>{
            const file = new Blob([data],{ type: "application/pdf",  });
            saveAs(file, faturaNo+'-yevmiye-fisi.pdf');
        })
    }

    const saveInvoiceDocument = async (_ett,invoiceNo) => {
        api.downloadGet('/Invoice/DownloadInvoice',{ett:_ett,belgeTuru:'pdf'}).then(({data})=>{
            const file = new Blob([data],{ type: "application/pdf",  });
            saveAs(file, (invoiceNo===undefined?_ett:invoiceNo)+'-fatura.pdf');
        })
    }

    

    return  {getInvoiceRawHtml,getInvoiceList,saveInvice,getInvoice,saveYevmiyeFisi,getYevmiyeFisi,saveInvoiceDocument,attachNote};
} 
