import React, { useEffect, useState } from 'react';
//import {SpeedDialButton,KaryaContainer} from '../../tools'
import DataGrid, { Column, FilterRow, Paging,StateStoring,Pager } from 'devextreme-react/data-grid';
import DropDownButton from 'devextreme-react/drop-down-button';
import { useInvoice,useGuide } from '../../contexts/hooks';
import { useAuth } from '../../contexts'
import Toolbar, { Item } from 'devextreme-react/toolbar';
import { InvoiceAttachNoteModal }  from './InvoiceAttachNoteModal';

import './InvoiceList.css'

let today = new Date();

const defaultFormData = {
    firstDate: null,
    lastDate: null,
    incomeFirstDate: today.toISOString(),
    incomeLastDate: today.toISOString(),
    senderVkn: "",
    senderName: "",
    companyVkn: "",
    invoiceStatus: 0
}

const columns = [
//{ dataField: 'kayitli',         caption: 'Aktarıldı', dataType: "boolean" },
{ dataField: 'faturaTarihi',    caption: 'Fatura Tarihi', dataType: "date", format:"dd/MM/yyyy"},
{ dataField: 'faturaNo',        caption: 'Fatura No', dataType: "string" },
{ dataField: 'defaultNote',       caption: 'Not', dataType: "string" },
{ dataField: 'cariKodu',        caption: 'Cari Kodu', dataType: "string" },
{ dataField: 'gonderenUnvan',   caption: 'Gönderen Unvan', dataType: "string" },
{ dataField: 'cariVkn',         caption: 'Gönderen Vkn', dataType: "string" },
{ dataField: 'alanUnvan',       caption: 'Alan Unvan', dataType: "string" },
//{ dataField: 'belgeTipi',       caption: 'Fatura Tipi', dataType: "string" },
//{ dataField: 'paraBirimi',      caption: 'Döviz', dataType: "string" },
{ dataField: 'toplamFiyat',     caption: 'Top. Fiyat', dataType: "number", format: '#,##0.##' },
{ dataField: 'toplamVergi',     caption: 'Top. Vergi', dataType: "number", format: '#,##0.##' },
{ dataField: 'toplamTutar',     caption: 'Top. Tutar', dataType: "number", format: '#,##0.##' }];

export default  React.memo((props) => {
    const {onInvoiceClick,onRowMenuClick} = props;
    const [sirketData, setSirketData] = useState(JSON.parse(localStorage.getItem('invoice-company-data'))===null ? []:JSON.parse(localStorage.getItem('invoice-company-data')));
   
    const [formData, setFormData] = useState(JSON.parse(localStorage.getItem('invoice-filter'))===null ? defaultFormData:JSON.parse(localStorage.getItem('invoice-filter')));
    
    const invoice = useInvoice();
    const guide = useGuide();
    const { state } = useAuth();
    const [invoiceData, setInvoiceData] = useState(JSON.parse(localStorage.getItem('invoice-data')));
    const [openNoteAttacher, setOpenNoteAttacher] = React.useState({open:false, notes:[],invoiceId:0});

    useEffect(() => {
        var _invoiceData=localStorage.getItem('invoice-data');

        if(_invoiceData===undefined || _invoiceData===null || _invoiceData==="" ){
            loadData();
        }
    }, []);

    const onRowDblClick = (e) => {
        //window.open('/invoice/view/' + e.data.guid + '/' + e.data.faturaNo,)
        if(onInvoiceClick!==undefined)
            onInvoiceClick(e);
        else
            window.open('/invoice/view/' + e.data.guid + '/' + e.data.faturaNo)
    }

    const loadData =()=>{
        console.log('form data : ',formData)
        if(((formData.firstDate===null || formData.lastDate===null ) && (formData.incomeFirstDate===null || formData.incomeLastDate===null ))){
            if(formData.senderVkn==="" && formData.senderName==="" && formData.companyVkn==="" && formData.invoiceStatus===0)
            return;
        }
        
        invoice.getInvoiceList(formData).then((data) => {
            localStorage.removeItem('invoice-grid-list');
            localStorage.setItem('invoice-data',JSON.stringify(data));
            localStorage.setItem('invoice-filter',JSON.stringify(formData));
            setInvoiceData(data)
            if(sirketData.length===0)
                guide.getCompanyList().then(x=> {
                    localStorage.setItem('invoice-company-data',JSON.stringify(x.data));
                    setSirketData(x.data)
                })
        });
    }

    
    const handleClickRowMenu = (e,data) =>{
        if(e.itemData.id===2){
            var noteList=data.userNotes!==null?JSON.parse(data.userNotes):[]
            setOpenNoteAttacher({open:true, notes:noteList, invoiceId:data.id});
        }else{
            onRowMenuClick(e,data)
        }
    }
    
    const customCellRender = (prop)=>{
        
        var items = [{ id: 1, name: 'Fatura Önizle', icon: 'rtffile' },{ id: 2, name: 'Not İliştir', icon: 'pin' }];

        if(prop.data.cariKodu!==null) items.push({ id: 3, name: 'Yevmiye Fişi', icon: 'orderedlist' });

        if(prop.column.dataField==='kayitli' ){
            return <DropDownButton
            style={{margin:'-10px'}}
            icon="more"
            stylingMode={'text'}
            dropDownOptions={{ width: 230 }}
            displayExpr="name"
            keyExpr="id"
            items = {items}
            onItemClick={e=>handleClickRowMenu(e,prop.data)}
          />
        }else{
            return prop.text
        }
        
    }

    const selectBoxOptions = {
        items: sirketData,
        value:formData.companyVkn,
        valueExpr: 'vkn',
        displayExpr: 'unvan',
        onValueChanged:(e) => setFormData({ ...formData, companyVkn: e.value })
    };

    const  gonderenVknBoxOptions = {
        mask: '00000000000',
        maskRules: {
            X: /[02-9]/
        },
        useMaskedValue: true,
        value:formData.senderVkn,
        maskInvalidMessage: 'Numara formatı düzgün olmalı',
        onValueChanged:(e) => setFormData({ ...formData, senderVkn: e.value })
    };
    
    const saveNote = async (note) => {
        setOpenNoteAttacher(false);
        var today = new Date();
        var _date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDay()+' '+today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
        console.log(_date)
    
        let newNotes = Object.assign(openNoteAttacher.notes);
        newNotes.unshift({userName:state.user, note:note, createDate:_date});
        var result = await invoice.attachNote(openNoteAttacher.invoiceId,newNotes);
        if(result.success){
            var _listData = JSON.parse(localStorage.getItem('invoice-data'));
            var _index = _listData.findIndex(x=>x.id===openNoteAttacher.invoiceId);
            _listData[_index].defaultNote=newNotes[0].note;
            _listData[_index].userNotes=JSON.stringify(newNotes);
            localStorage.setItem('invoice-data',JSON.stringify(_listData));
            setInvoiceData(JSON.parse(localStorage.getItem('invoice-data')));
            
        }
        

        console.log('note ', result)
    };

    const saveCustomGridState = React.useCallback((state) => {
        if(state.pageSize!==0){
            localStorage.setItem('invoice-grid-list',JSON.stringify(state));
        }
    }, []);
    const loadCustomGridState = React.useCallback(() => {
        return JSON.parse(localStorage.getItem('invoice-grid-list'));
    }, []);

    return (
        <React.Fragment>
            <InvoiceAttachNoteModal invoiceId={openNoteAttacher.invoiceId}  open={openNoteAttacher.open} 
            notes={openNoteAttacher.notes} onClose={(e) => setOpenNoteAttacher(false)} saveNote={saveNote}/>
            <h3 className={'content-block'}>Gelen Faturalar</h3>
            
            <div className={'content-block dx-card responsive-paddings'}>
            <Toolbar style={{ borderBottom: "2px solid rgb(255, 87, 34,1)", marginBottom:  "10px"}} >
                <Item location="before" cssClass="karya-toolbar" html=" <div class='toolbar-label'>Fat.Tarih-1</div>"       widget="dxDateBox"      locateInMenu="auto" options={{value:formData.firstDate, displayFormat:"dd/MM/yyyy", type:"date", onValueChanged:(e) => setFormData({ ...formData, firstDate: e.value })}} />
                <Item location="before" cssClass="karya-toolbar" html=" <div class='toolbar-label'>Fat.Tarih-2</div>"       widget="dxDateBox"      locateInMenu="auto" options={{value:formData.lastDate, displayFormat:"dd/MM/yyyy", type:"date", onValueChanged:(e) => setFormData({ ...formData, lastDate: e.value })}}/>
                <Item location="before" cssClass="karya-toolbar" html=" <div class='toolbar-label'>Gelis Tarih-1</div>"     widget="dxDateBox"      locateInMenu="auto" options={{value:formData.incomeFirstDate, displayFormat:"dd/MM/yyyy", type:"date", onValueChanged:(e) => setFormData({ ...formData, incomeFirstDate: e.value })}} />
                <Item location="before" cssClass="karya-toolbar" html=" <div class='toolbar-label'>Gelis Tarih-2</div>"     widget="dxDateBox"      locateInMenu="auto" options={{value:formData.incomeLastDate, displayFormat:"dd/MM/yyyy", type:"date", onValueChanged:(e) => setFormData({ ...formData, incomeLastDate: e.value })}}/>
                <Item location="before" cssClass="karya-toolbar" html=" <div class='toolbar-label'>Şirket/Şube</div>"       widget="dxSelectBox"    locateInMenu="auto" options={selectBoxOptions} />
                <Item location="before" cssClass="karya-toolbar" html=" <div class='toolbar-label'>Gön. Ünvan</div>"        widget="dxTextBox"      locateInMenu="auto" options={{value:formData.senderName, onValueChanged:(e) => setFormData({ ...formData, senderName: e.value })}}/>
                <Item location="before" cssClass="karya-toolbar" html=" <div class='toolbar-label'>Gön. Vkn</div>"          widget="dxTextBox"      locateInMenu="auto" options={gonderenVknBoxOptions}/>
                <Item location="after"  locateInMenu="never"                                                                widget="dxButton"                           options={{icon: 'search', onClick:loadData}}/>
               
            </Toolbar>
                <DataGrid
                    className={"invoiceGrid"}
                    rowAlternationEnabled={true}
                    selection={{ mode: 'single', color: 'red' }}
                    showBorders={true}
                    columnHidingEnabled={true}
                    allowColumnResizing={true}
                    columnResizingMode={"widget"}
                    columnMinWidth={50}
                    columnMaxWidth={150}
                    columnAutoWidth={true}
                    width={'100%'}
                    dataSource={invoiceData}
                    onRowPrepared={(e)=>{
                        if (e.rowType !== "data")
                            return;
                        if (e.data.kayitli) {
                            e.rowElement.classList.add("green-row");
                        }
                        if (e.data.kayitli===false && e.data.cariKodu!==null) {
                            e.rowElement.classList.add("blue-row");
                        }
                    }}
                    //defaultColumns={columns}
                    onRowDblClick={onRowDblClick}
                >
                    <Paging defaultPageSize={15} />
                    <Column key={0}
                                tabIndex={-1}
                                dataField={'kayitli'}
                                caption={'Aktarıldı'}
                                cssClass={"column"}
                                cellRender={customCellRender}
                                width={70}
                                style={{ textAlign: 'right'}}>

                    </Column>
                    {
                        columns.map(({ dataField, caption, dataType, format }, index) => (
                            <Column key={index+1}
                                tabIndex={-1}
                                dataField={dataField}
                                caption={caption}
                                format={format}
                                dataType={dataType}
                                
                                cssClass={"column"}
                                //cellRender={customCellRender}
                                //width={"auto"}
                                style={{ textAlign: 'right'}}>

                            </Column>
                        ))
                    }
                    <FilterRow visible={true}></FilterRow> 
                    <Pager showPageSizeSelector={true} defaultPageSize={15} allowedPageSizes={[10, 15,25]} />
                    <StateStoring enabled={true} type="custom" customLoad={loadCustomGridState} customSave={saveCustomGridState}/>
                </DataGrid>
            </div>
        </React.Fragment>
    )
})


