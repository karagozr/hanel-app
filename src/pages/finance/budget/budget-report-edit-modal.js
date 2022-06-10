import React, { useState, useEffect, useRef } from 'react';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import DataGrid, { Column, Lookup, Paging, Scrolling, Summary, TotalItem, Editing } from 'devextreme-react/data-grid';

import { Button, SelectBox } from 'devextreme-react';
import { NumberBox } from 'devextreme-react/number-box';

import ScrollView from 'devextreme-react/scroll-view';
import { parseDate } from 'devextreme/localization';


export const BudgetEditModal = ({ open, onClose,generalData, dataSource, saveData, exchangeDatasource }) => {
    const modal = useRef();
    const formRef = useRef();
    const subFormRef = useRef();

    const [contentHeight, setContentHeight] = useState(0);

    const handlePopupContent = (e) => {
        
        var contexts= document.getElementsByClassName('dx-popup-content');
        for (let i = 0; i < contexts.length; i++) {
           
            if(document.getElementsByClassName('dx-popup-content')[i].offsetHeight>0){
                
                setContentHeight(contexts[i].offsetHeight);
                break;
            };
            
        }
        
    }


    const handleSubmit = (e) => {
        saveData(dataSource);
    }

    const calculateSummRow = (options) =>{
        // if (options.name === 'budgetJanuary') {
        //     if (options.summaryProcess === 'start') {
        //       options.totalValue = 0;
        //     } else if (options.summaryProcess === 'calculate') {
        //         console.log(":::: ", exchangeDatasource.find(x=>x.currencyCode==="USD" && x.enable ).periodDate);
        //         options.totalValue += options.value["budgetJanuary"];
        //     }
        // }
    }


    return (
        <Popup
            key="ssdsfsdfsd-asasfa"
            visible={open}
            ref={modal}
            onHiding={onClose}
            dragEnabled={true}
            closeOnOutsideClick={false}
            showTitle={true}
            // width={320}
            // height={500}
            resizeEnabled={true}
            title={generalData.projectName+" - "+generalData.name+" - Ekle/Düzenle"}
            onShown={handlePopupContent}
            onResizeEnd={handlePopupContent}

            showCloseButton={true}>
            <div id={"modal-content"} >
                <DataGrid
                    className={"budget-edit-detail-modal-grid"}
                    rowAlternationEnabled={true}
                    selection={{ mode: 'single', color: 'red' }}
                    showBorders={true}
                    height={contentHeight-30}
                    columnHidingEnabled={true}
                    allowColumnResizing={true}
                    columnResizingMode={"widget"}
                    columnAutoWidth={true}
                    width={'100%'}

                    dataSource={dataSource}
                >
                    <Editing allowEditing={true} allowAdding={true} allowDeleting={true} allowUpdating={true}/>
                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={true} />

                    <Column  tabIndex={-1} dataField={'description'}            caption={'Açıklama'} dataType='string'  />
                    <Column  tabIndex={-1} dataField={'currencyCode'}           caption={'Seçili Döviz'}    dataType="string" allowEditing={true} >
                        <Lookup dataSource={["TL","USD","EUR"]}  />    
                    </Column>
                    <Column  tabIndex={-1} dataField={'budgetJanuary'}          caption={'Ocak'}        dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    <Column  tabIndex={-1} dataField={'budgetFebruary'}         caption={'Şubat'}       dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    <Column  tabIndex={-1} dataField={'budgetMarch'}            caption={'Mart'}        dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    <Column  tabIndex={-1} dataField={'budgetApril'}            caption={'Nisan'}       dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    <Column  tabIndex={-1} dataField={'budgetMay'}              caption={'Mayıs'}       dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    <Column  tabIndex={-1} dataField={'budgetJune'}             caption={'Haziran'}     dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    <Column  tabIndex={-1} dataField={'budgetJuly'}             caption={'Temmuz'}      dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    <Column  tabIndex={-1} dataField={'budgetAugust'}           caption={'Ağustos'}     dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    <Column  tabIndex={-1} dataField={'budgetSeptember'}        caption={'Eylül'}       dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    <Column  tabIndex={-1} dataField={'budgetOctober'}          caption={'Ekim'}        dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    <Column  tabIndex={-1} dataField={'budgetNovember'}         caption={'Kasım'}       dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    <Column  tabIndex={-1} dataField={'budgetDecember'}         caption={'Aralık'}      dataType="number" format={{ type: "fixedPoint", precision: 2 }} />
                    

                    <Summary calculateCustomSummary={calculateSummRow}>
                        <TotalItem showInColumn = {'budgetJanuary'}   name= {'budgetJanuary'}    summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint"  />
                        <TotalItem showInColumn = {'budgetFebruary'}  name= {'budgetFebruary'}   summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint" />
                        <TotalItem showInColumn = {'budgetMarch'}     name= {'budgetMarch'}      summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint" />
                        <TotalItem showInColumn = {'budgetApril'}     name= {'budgetApril'}      summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint" />
                        <TotalItem showInColumn = {'budgetMay'}       name= {'budgetMay'}        summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint" />
                        <TotalItem showInColumn = {'budgetJune'}      name= {'budgetJune'}       summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint" />
                        <TotalItem showInColumn = {'budgetJuly'}      name= {'budgetJuly'}       summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint" />
                        <TotalItem showInColumn = {'budgetAugust'}    name= {'budgetAugust'}     summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint" />
                        <TotalItem showInColumn = {'budgetSeptember'} name= {'budgetSeptember'}  summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint" />
                        <TotalItem showInColumn = {'budgetOctober'}   name= {'budgetOctober'}    summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint" />
                        <TotalItem showInColumn = {'budgetNovember'}  name= {'budgetNovember'}   summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint" />
                        <TotalItem showInColumn = {'budgetDecember'}  name= {'budgetDecember'}   summaryType = "custom" displayFormat = "{0}"  valueFormat="fixedPoint" />
                    </Summary> 


                
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
                    useSubmitBehavior: true,
                    onClick: (e) =>true && handleSubmit(e)
                }}
            />
        </Popup>

    );
}
