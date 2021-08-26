import React,{useState,useRef} from 'react';
import { useHistory } from "react-router-dom";
import { Popup } from 'devextreme-react/popup';
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';


export const YevmiyeFisModal=({open,onClose,data,downloadYevmiyeFisi}) => {
  const history = useHistory();
  const modal = useRef();
  const dataGridRef = useRef();
  const [contentHeight,setContentHeight]=useState(0);

  
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
        onShown={(e)=>setContentHeight(document.getElementById('modal-content').clientHeight)}
        toolbarItems={
          [{
            location: 'before',
            widget: 'dxButton',
            options: {
                stylingMode:'text',
                icon:"print",
                text:"Pdf",
                onClick : (e)=>downloadYevmiyeFisi(data.faturaNo, data.cariKodu)
            }
          },{
            toolbar:'bottom',
            location: 'after',
            widget: 'dxButton',
            options: {
                stylingMode:'text',
                icon:"close",
                text:"Kapat",
                onClick:(e)=>history.push('/invoice-panel')
            }
          }
        ]}
        showCloseButton={true}>
          
      
          <div id={"modal-content"} style={{height:'95%'}}>
            
          <DataGrid
          id="gridContainerYevmiyeFisModal"
          ref={dataGridRef}
          dataSource={data.yevmiyeFisi}
          allowColumnReordering={true}
          showBorders={true}
          rowAlternationEnabled={true}
          columnAutoWidth={true}
          height={contentHeight-20}>

          <Paging enabled={false} />
          {/* <SearchPanel visible={true} highlightCaseSensitive={true}/> */}
          <Column dataField="hesapKodu" idth={160}  caption="Hesap Kodu" cellRender={(e)=>e.value[0]===' '?<div>&nbsp;&nbsp;{e.text}</div>: e.text}/>
          <Column dataField="hesapAdi" caption="Hesap" />
          <Column dataField="aciklama" caption="Açıklama"/>
          <Column dataField="borc"  width={100} caption="Borç" dataType='number' format={{ type: "fixedPoint", precision: 2 }}  cellRender={(e)=>e.value===0?"": e.text}/>
          <Column dataField="alacak" width={100} caption="Alacak" dataType='number' format={{ type: "fixedPoint", precision: 2 }} cellRender={(e)=>e.value===0?"": e.text}/>
          <Column dataField="projeAdi" caption="Proje"/>
          <Column dataField="referansAdi" caption="Referans"/>
          <Column dataField="aciklama2" caption="Açıklama - 2"/>
          <Column dataField="aciklama3" caption="Açıklama - 3"/>
          
        </DataGrid>
          </div>
          
      </Popup>
      
  );
}
