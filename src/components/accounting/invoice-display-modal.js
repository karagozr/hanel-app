import React from 'react'
import { BaseModal } from '../modal'
import { useModal } from '../../contexts'
import _ from "lodash"
import { HtmlViewer } from '../viewers';
import { ToolbarItem } from 'devextreme-react/popup'

const InvoiceDisplayModal = () => {
  const modal = useModal();
  const htmlViewerRef = React.useRef();

  const data = React.useMemo(() => {
    return modal.getData();
  }, [modal])

  if(!modal.isOpen("invoice-display")) return null;
  return (
    <BaseModal modalId="invoice-display" title={data && data.title} >
      <HtmlViewer ref={htmlViewerRef} data={data && data.document} width={'100%'} height={'100%'} />

      {data && <ToolbarItem widget="dxButton" toolbar="top"  location="after" options={{stylingMode: 'text',  icon: 'print',  type: 'default',  text: 'Yazdır',  onClick: (e) =>  htmlViewerRef.current.printIframe() }}  />}
      
     {data && data.handleDownload && <ToolbarItem widget="dxButton" toolbar="top" location="after" options={{ stylingMode: 'text', icon: 'save', type: 'normal',  text: 'Pdf', onClick: (e) =>  data.handleDownload(e) }} />}

    </BaseModal>
  )
}


const useInvoiceDisplayModal = () => {
  const { openModal } = useModal();
  const open = (data) => openModal("invoice-display", data)
  return {
    open
  }
}

export {
  InvoiceDisplayModal,
  useInvoiceDisplayModal
}

InvoiceDisplayModal.propTypes = {}


