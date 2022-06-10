import React, { useState, useEffect, useRef } from 'react';
import { Popup, ToolbarItem } from 'devextreme-react/popup';
import DataGrid, { Column, FilterRow, Paging, Scrolling, Summary, TotalItem } from 'devextreme-react/data-grid';


import Form, {
    SimpleItem,
    GroupItem,
    Label,
    ButtonItem
} from 'devextreme-react/form';



export const ConsActivityDetailModal = ({ open, onClose, dataSource }) => {
    const modal = useRef();
    const subFormRef = useRef();
    const [contentHeight, setContentHeight] = useState(0);

    // const handlePopupContent = (e) => {
    //     console.log("handlePopupContent : ", document.getElementsByClassName('dx-popup-content'));
    //     let popupContentHeight = document.getElementsByClassName('dx-popup-content')[1].clientHeight - 30 
    //     setContentHeight(popupContentHeight)
    // }



    // React.useEffect(()=>{

    // },[dataSource])

    console.log('contentHeight : ', contentHeight)

    // document.getElementsByClassName('dx-popup-content');

    // const rowUpdated = (e) => {
    //     console.log("ddd ", dataSource.authGroupDetails[0]);
    // }

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     saveData(e);

    // }

    return (
        <Popup
            visible={open}
            ref={modal}
            onHiding={onClose}
            dragEnabled={true}
            closeOnOutsideClick={false}
            showTitle={true}
            resizeEnabled={true}
            title="Detay Kayıtlar"
            defaultWidth={window.innerWidth > 1000 ? window.innerWidth * 0.9 : window.innerWidth * 0.95}
            defaultHeight={window.innerHeight * 0.95}
            showCloseButton={true}>
            <div id={"modal-content"} style={{ height: '100%' }} >
                <DataGrid
                    className={"pl-report-detail-modal-grid"}
                    rowAlternationEnabled={true}
                    selection={{ mode: 'single', color: 'red' }}
                    showBorders={true}
                    height={"100%"}
                    columnHidingEnabled={true}
                    allowColumnResizing={true}
                    columnResizingMode={"widget"}
                    columnAutoWidth={true}
                    width={'100%'}

                    dataSource={dataSource}
                >

                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={true} />

                    <Column tabIndex={-1} dataField={'proccessDate'} caption={'Tarih'} dataType={'date'} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'recordCode'} caption={'Fiş No'} dataType={'string'} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'groupCode'} caption={'Grup Kod'} dataType={'string'} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'groupName'} caption={'Grup'} dataType={'string'} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'subGroupCode'} caption={'Alt Kod'} dataType={'string'} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'subGroupName'} caption={'Alt Aç.'} dataType={'string'} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'mainCode'} caption={'Kod'} dataType={'string'} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'mainName'} caption={'Kod Aç. (Stok)'} dataType={'string'} cssClass={"column"} />

                    <Column tabIndex={-1} dataField={'description'} caption={'Açıklama'} dataType={'string'} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'currentAccountCode'} caption={'Cari Kodu'} dataType={'string'} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'currentAccountName'} caption={'Cari Açıklama'} dataType={'string'} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'quantity'} caption={'Miktar'} dataType={'number'} format={{ type: "fixedPoint", precision: 2 }} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'unitPrice'} caption={'Birim Fiyat'} dataType={'number'} format={{ type: "fixedPoint", precision: 2 }} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'amount'} caption={'Tutar(Bakiye)'} dataType={'number'} format={{ type: "fixedPoint", precision: 2 }} cssClass={"column"} />
                    <Column tabIndex={-1} dataField={'updateUser'} caption={'Kayıt. Kul.'} dataType={'string'} cssClass={"column"} />

                    <Summary>
                        <TotalItem
                            column="amount"
                            summaryType="sum"
                            displayFormat="{0}"
                            valueFormat="fixedPoint" />
                    </Summary>


                    <FilterRow visible={true}></FilterRow>
                    {/* <Pager showPageSizeSelector={true} defaultPageSize={gridHeight} allowedPageSizes={[gridHeight-10,gridHeight-5,gridHeight ]} /> */}
                    {/* <StateStoring enabled={true} type="custom" customLoad={loadCustomGridState} customSave={saveCustomGridState}/> */}
                </DataGrid>
            </div>
            <ToolbarItem
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={{
                    icon: 'save',
                    type: 'success',
                    text: 'Kaydet',
                    // onClick: (e) => subFormRef.current.instance.validate().isValid && formRef.current.dispatchEvent(
                    //     new Event("submit", { cancelable: true })
                    // )
                }}
            />



        </Popup>

    );
}
