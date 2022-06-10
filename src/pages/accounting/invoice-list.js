import React from 'react'
import PropTypes from 'prop-types'
import {PageLayout,InvoceListTable, FilterArea, PageLayoutWithDrawer, BaseModal, BaseEditModal, InvoiceDisplayModal} from '../../components'
import { Button, Drawer } from 'devextreme-react'
import { getCurrentWeekFirstDate, getCurrentWeekLastDate, getCurrentYear } from '../../helper'
import { FilterAreaProvider, ModalProvider, useFilterArea } from '../../contexts'
import { useGuide } from '../../contexts/hooks'
import _ from 'lodash'
import { InvoiceSavedModal } from '../../components/accounting/invoice-saved-modal'

export const InvoceList = (props) => {
  

  const guide = useGuide();
  const {setFilterData,filterData} = useFilterArea();
   
  const [sirketData,setSirketData] = React.useState();

  React.useEffect(()=>{
    fetchData();
    if(_.isEmpty(filterData) && !_.isEmpty(initialFilterData) ) setFilterData(initialFilterData);
  },[])



  const fetchData = async () => {

    if(_.isEmpty(localStorage.getItem('invoice-company-data'))){
      var res = await guide.getCompanyList();
      localStorage.setItem('invoice-company-data',JSON.stringify(res.data));
      setSirketData(res.data);
    }else{
      setSirketData(JSON.parse(localStorage.getItem('invoice-company-data')));
    }
    
  }

  const filterFields = [
    { fieldName: "firstDate",    label: "Tarih 1",    editorType:"dxDateBox" },
    { fieldName: "lastDate",     label: "Tarih 2",    editorType:"dxDateBox" },
    { fieldName: "companyVkn",   label: "Şirket/Şube",editorType:"dxSelectBox",placeHolder:"Seç", editorOptions:{items: sirketData, valueExpr: 'vkn', displayExpr: 'unvan'}},
    { fieldName: "senderName",   label: "Gön. Ünvan", editorType:"dxTextBox" }
]

  return (
    
    <ModalProvider>
      <InvoiceDisplayModal />
      <InvoiceSavedModal/>
        <PageLayoutWithDrawer caption={"Gelen Fatura Listesi"} 
          captionComponent={<FilterArea  caption={"Fatura Filtre"}  //applyFilter={e=>console.log("--- : ",e)}
          initialData={initialFilterData}
          fields={filterFields} /> }>
        <InvoceListTable/>
      </PageLayoutWithDrawer>
    </ModalProvider>

  )
}

const initialFilterData = {
  firstDate:getCurrentWeekFirstDate(),lastDate:getCurrentWeekLastDate()
}





InvoceList.propTypes = {}


