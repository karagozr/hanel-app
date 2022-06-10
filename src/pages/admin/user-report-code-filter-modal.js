import React, { useState, useEffect, useRef } from 'react';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import DataGrid, { Column, FilterRow, Paging, Scrolling, Editing, SearchPanel, Toolbar as DxToolbar, Item as DxToolbarItem } from 'devextreme-react/data-grid';

import SelectBox from 'devextreme-react/select-box';
import { Button } from 'devextreme-react/button';

import ScrollView from 'devextreme-react/scroll-view';

export const UserReportCodeFilterModal = ({ open, onClose, dataSource, saveData, getData, projectsData }) => {
    const modal = useRef();
    const gridTableRef = useRef();
    const subFormRef = useRef();
    const [contentHeight, setContentHeight] = useState(0);

    document.getElementsByClassName('dx-popup-wrapper');


    const handleSubmit = (e) => {
       
        saveData();
    }


    const checkSelected = (state) =>{
        
        

        var selectedRows = gridTableRef.current.instance.getSelectedRowsData();
        if(selectedRows.length===0) return;

        if(state==="read"){
            selectedRows.forEach(element => {
                element.accessRead = !element.accessRead;
            });
        }else if(state==="add"){
            selectedRows.forEach(element => {
                element.accessAdd = !element.accessAdd;
            });
        }else if(state==="update"){
            selectedRows.forEach(element => {
                element.accessUpdate = !element.accessUpdate;
            });
        }else if(state==="delete"){
            selectedRows.forEach(element => {
                element.accessDelete = !element.accessDelete;
            });
        }


        gridTableRef.current.instance.refresh();
    }
    

    const filterCodesForUser = (e) => {
        getData(e.value);
    }
    // accessAdd: false
    // accessDelete: false
    // accessRead: false
    // accessUpdate: false
    // branchCode: null
    // id: 0
    // integrationCode1: "G00-01"
    // integrationCode2: ""
    // integrationCode3: ""
    // name: "Elektrik Satış Gelirleri"
    // projectCode: null
    // userId: 1



    return (
        <Popup
            visible={open}
            ref={modal}
            onHiding={onClose}
            dragEnabled={true}
            closeOnOutsideClick={false}
            showTitle={true}
            resizeEnabled={true}
            title="Rapor / Bütçe Yetkilendirme Ekle/Düzenle"
            onShown={(e) => setContentHeight(document.getElementById('modal-content').clientHeight)}

            showCloseButton={true}>
            <ScrollView width='100%' height='100%'>
                <div id={"modal-content"} style={{ height: '100%' }}>
                    <DataGrid
                        ref={gridTableRef}
                        className={"pl-report-detail-modal-grid"}
                        rowAlternationEnabled={true}
                        selection={{ mode: 'multiple', color: 'red', selectAllMode:'allPages',showCheckBoxesMode:'onClick' }}
                        showBorders={true}
                        height={window.innerHeight * 0.7}
                        columnHidingEnabled={true}
                        allowColumnResizing={true}
                        columnResizingMode={"widget"}
                        columnAutoWidth={true}
                        width={'100%'}
                        

                        dataSource={dataSource}
                    >

                        <Scrolling columnRenderingMode="virtual" />
                        <Paging enabled={false} />
                        <SearchPanel visible={true} />
           
                        <Column tabIndex={-1} allowEditing={false} dataField={'integrationCode1'} caption={'Kod'} dataType={'string'} cssClass={"column"} />
                        <Column tabIndex={-1} allowEditing={false} dataField={'name'} caption={'Açıklama'} dataType={'string'} cssClass={"column"} />

                        <Column tabIndex={-1} dataField={'accessRead'} caption={'Okuma'} dataType={'boolean'} cssClass={"column"} />
                        <Column tabIndex={-1} dataField={'accessAdd'} caption={'Ekleme'} dataType={'boolean'} cssClass={"column"} />
                        <Column tabIndex={-1} dataField={'accessUpdate'} caption={'Güncelleme'} dataType={'boolean'} cssClass={"column"} />
                        <Column tabIndex={-1} dataField={'accessDelete'} caption={'Silkme'} dataType={'boolean'} cssClass={"column"} />

                        <Editing
                            mode="cell"
                            allowAdding={false}
                            allowUpdating={true}
                            allowDeleting={false}>

                        </Editing>
                        <DxToolbar>


                            <DxToolbarItem location="before" >
                                <SelectBox id="custom-templates"
                                    dataSource={projectsData}
                                    displayExpr="projectName"
                                    valueExpr="projectCode"
                                    onValueChanged={filterCodesForUser}
                                    //defaultValue={} 
                                    
                                    />
                            </DxToolbarItem>

                            <DxToolbarItem location="before" >
                                <Button icon='search' text="Okuma" onClick={e=>checkSelected("read")}></Button>
                            </DxToolbarItem>

                            <DxToolbarItem location="before" >
                                <Button icon='add' text="Ekleme" onClick={e=>checkSelected("add")}></Button>
                            </DxToolbarItem>

                            <DxToolbarItem location="before" >
                                <Button icon='edit'  text="Düzenleme"onClick={e=>checkSelected("update")}></Button>
                            </DxToolbarItem>

                            <DxToolbarItem location="before" >
                                <Button icon='remove'  text="Silme" onClick={e=>checkSelected("delete")}></Button>
                            </DxToolbarItem>
                            <DxToolbarItem name="columnChooserButton"  />
                         



                            <DxToolbarItem location="after" name="searchPanel" />

                        </DxToolbar>


                        {/* <Pager showPageSizeSelector={true} defaultPageSize={gridHeight} allowedPageSizes={[gridHeight-10,gridHeight-5,gridHeight ]} /> */}
                        {/* <StateStoring enabled={true} type="custom" customLoad={loadCustomGridState} customSave={saveCustomGridState}/> */}
                    </DataGrid>
                </div>
            </ScrollView>
            <ToolbarItem
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={{
                    icon: 'save',
                    type: 'success',
                    text: 'Kaydet',
                    useSubmitBehavior: true,
                    onClick: (e) => handleSubmit(e)//subFormRef.current.instance.validate().isValid && handleSubmit(e)
                }}
            />
        </Popup>

    );
}
