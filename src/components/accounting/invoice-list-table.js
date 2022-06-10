import React from 'react'
import PropTypes from 'prop-types'
import { Button, DataGrid, DropDownButton } from 'devextreme-react';
import { Column, FilterRow, Pager, Paging, Scrolling, StateStoring } from 'devextreme-react/data-grid';
import { useInvoice } from '../../contexts/hooks';
import { useFilterArea, useModal } from '../../contexts';
import _ from "lodash"
import { InvoiceDisplayModal,useInvoiceDisplayModal } from '..';
import { useInvoiceSavedModal } from './invoice-saved-modal';

export const InvoceListTable = () => {

  const invoiceDisplay =  useInvoiceDisplayModal();
  const invoiceSaved = useInvoiceSavedModal();

  const invoice = useInvoice();
  const {filterData} = useFilterArea();

  const [data,setData] = React.useState();


  React.useEffect(() => {
    console.log("Filter Data : ",filterData)
    var _invoiceData=localStorage.getItem('invoice-data');  

    if(_.isEmpty(_invoiceData)){
      loadData();
    }
    
  }, [filterData]);


  
  const loadData = async () => {
  
    
    if(_.isEmpty(filterData)) return;

    var res = await invoice.getInvoiceList(filterData);
    
    setData(res)
        
      
  
  }







  const onRowDblClick = (e) =>{

  }

  const handleClickRowMenu = async (e,data) =>{

    if(e.itemData.id===1){

      invoiceDisplay.open();
      var res = await invoice.getInvoiceRawHtml(data.guid);
      
      invoiceDisplay.open({ 
        title:data.faturaNo+' : '+data.gonderenUnvan,
        document:res,
        handleDownload:async () => await invoice.saveInvoiceDocument(data.guid,data.guid),

      });

    }else if(e.itemData.id===3){
      var res = await invoice.getYevmiyeFisi(data.faturaNo,data.cariKodu)
      invoiceSaved.open({
        title:'Yevmiye Fişi : '+data.faturaNo,
        invoiceData:res,
        handleDownload:async () => await invoice.saveYevmiyeFisi(data.faturaNo,data.cariKodu),
      });
    
   }
  }

 
  const customCellRender = (prop) => {



    var items = [{ id: 1, name: 'Fatura Önizle', icon: 'rtffile' }, { id: 2, name: 'Not İliştir', icon: 'pin' }];

    if (prop.data.cariKodu !== null) items.push({ id: 3, name: 'Yevmiye Fişi', icon: 'orderedlist' });

    if (prop.column.dataField === 'kayitli') {
      return <DropDownButton
        style={{ margin: '-10px' }}
        icon="more"
        stylingMode={'text'}
        dropDownOptions={{ width: 230 }}
        displayExpr="name"
        keyExpr="id"
        items={items}
        onItemClick={e => handleClickRowMenu(e, prop.data)} />
    } else {
      return prop.text
    }

  }

  return (
    <React.Fragment>
      
      <DataGrid
        className={"invoice-list-table"}
        rowAlternationEnabled={true}
        selection={{ mode: 'single', color: 'red' }}
        showBorders={true}
        columnHidingEnabled={true}
        allowColumnResizing={true}
        columnResizingMode={"widget"}
        dataSource={data}
        height={"100%"}
        onRowPrepared={(e) => {
          if (e.rowType !== "data")
            return;
          if (e.data.kayitli) {
            e.rowElement.classList.add("green-row");
          }
          if (e.data.kayitli === false && e.data.cariKodu !== null) {
            e.rowElement.classList.add("blue-row");
          }
        }}
        onRowDblClick={onRowDblClick} >
        <Scrolling columnRenderingMode="virtual" />
        <Column key={0} 
          tabIndex={-1}
          dataField={'kayitli'}
          caption={'Aktarıldı'}
          cssClass={"column"}
          cellRender={customCellRender}
          width={70}
          
          
          style={{ textAlign: 'right' }}>

        </Column>
        {
          columns && columns.map(({ dataField, caption, dataType, format }, index) => (
            <Column key={index + 1}
              tabIndex={-1}
              dataField={dataField}
              caption={caption}
              format={format}
              dataType={dataType}
              cssClass={"column"}
              style={{ textAlign: 'right' }}>

            </Column>
          ))
        }
        <FilterRow visible={true}></FilterRow>
        <Paging enabled={true}   />
        <StateStoring enabled={true} type="custom" customLoad={loadCustomGridState} customSave={saveCustomGridState} />
      </DataGrid>
    </React.Fragment>
  )
}

const saveCustomGridState = (state) => {
  if (state.pageSize !== 0) {
    localStorage.setItem('invoice-grid-list', JSON.stringify(state));
  }
};

const loadCustomGridState =() => {
  return JSON.parse(localStorage.getItem('invoice-grid-list'));
};


const columns = [
  //{ dataField: 'kayitli',         caption: 'Aktarıldı', dataType: "boolean" },
  { dataField: 'faturaTarihi',    caption: 'Fatura Tarihi', dataType: "date", format:"dd/MM/yyyy"},
  { dataField: 'faturaNo',        caption: 'Fatura No', dataType: "string" },
  //{ dataField: 'defaultNote',       caption: 'Not', dataType: "string" },
  { dataField: 'cariKodu',        caption: 'Cari Kodu', dataType: "string" },
  { dataField: 'gonderenUnvan',   caption: 'Gönderen Unvan', dataType: "string" },
  { dataField: 'cariVkn',         caption: 'Gönderen Vkn', dataType: "string" },
  { dataField: 'alanUnvan',       caption: 'Alan Unvan', dataType: "string" },
  //{ dataField: 'belgeTipi',       caption: 'Fatura Tipi', dataType: "string" },
  //{ dataField: 'paraBirimi',      caption: 'Döviz', dataType: "string" },
  { dataField: 'toplamFiyat',     caption: 'Top. Fiyat', dataType: "number", format: '#,##0.##' },
  { dataField: 'toplamVergi',     caption: 'Top. Vergi', dataType: "number", format: '#,##0.##' },
  { dataField: 'toplamTutar',     caption: 'Top. Tutar', dataType: "number", format: '#,##0.##' },
  { dataField: 'odenecekTutar',     caption: 'Öden. Tutar', dataType: "number", format: '#,##0.##' }];
  



InvoceListTable.propTypes = {}


