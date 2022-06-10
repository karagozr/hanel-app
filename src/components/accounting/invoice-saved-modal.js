import React from 'react'
import { BaseModal } from '../modal'
import { useModal } from '../../contexts'
import _ from "lodash"
import { HtmlViewer } from '../viewers';
import { ToolbarItem } from 'devextreme-react/popup'
import DataGrid, { Column, Paging } from 'devextreme-react/data-grid';

const InvoiceSavedModal = () => {
  const modal = useModal();

  const data = React.useMemo(() => {
    return modal.getData();
  }, [modal])

  if(!modal.isOpen("invoice-saved")) return null;
  return (
    <BaseModal modalId="invoice-saved" title={data && data.title} >
     <DataGrid
          id="gridContainerYevmiyeFisModal"
          // ref={dataGridRef}
          dataSource={data && data.invoiceData.yevmiyeFisi}
          allowColumnReordering={true}
          showBorders={true}
          rowAlternationEnabled={true}
          columnAutoWidth={true}
          height={"100%"}>

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

      {/* {data && <ToolbarItem widget="dxButton" toolbar="top"  location="after" options={{stylingMode: 'text',  icon: 'print',  type: 'default',  text: 'Yazdır',  onClick: (e) =>  htmlViewerRef.current.printIframe() }}  />} */}
      
     {data && data.handleDownload && <ToolbarItem widget="dxButton" toolbar="top" location="after" options={{ stylingMode: 'text', icon: 'save', type: 'normal',  text: 'Pdf', onClick: (e) =>  data.handleDownload(e) }} />}

    </BaseModal>
  )
}


const useInvoiceSavedModal = () => {
  const { openModal } = useModal();
  const open = (data) => openModal("invoice-saved", data)
  return {
    open
  }
}

export {
  InvoiceSavedModal,
  useInvoiceSavedModal
}

InvoiceSavedModal.propTypes = {}
