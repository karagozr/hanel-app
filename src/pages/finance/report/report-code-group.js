import React, { useEffect, useState } from 'react';
import { Popup } from 'devextreme-react/popup';
import DataGrid, { Column, Scrolling, Paging, SearchPanel,Editing } from 'devextreme-react/data-grid';


export const ReportCodeGroupModal = ({ open, onClose, data, title }) => {

    return (
        <React.Fragment>
            <Popup
                visible={open}
                onHiding={onClose}
                dragEnabled={true}
                closeOnOutsideClick={false}
                showTitle={true}
                resizeEnabled={true}
                defaultWidth={window.innerWidth > 1000 ? window.innerWidth * 0.4 : window.innerWidth * 0.95}
                defaultHeight={window.innerWidth > 1000? window.innerHeight *0.75 : window.innerHeight * 0.95}
                title={title}
                //onShown={(e) => setContentHeight(document.getElementById('modal-content').clientHeight)}
                showCloseButton={true}>
                <div id={"modal-content"} style={{ height: '100%' }}>
                    <DataGrid
                        dataSource={data}
                        allowColumnReordering={true}
                        showBorders={true}
                        rowAlternationEnabled={true}
                        columnAutoWidth={true}
                        selection={{ mode: 'single' }}
                        //columnHidingEnabled={true}
                        height={"100%"}>
                        <Editing
                            allowAdding={true}
                            allowUpdating={true}
                            allowDeleting={true}
                            mode="cell" />
                        <Scrolling columnRenderingMode="virtual" />
                        <Paging enabled={false} />
                        <SearchPanel visible={true} highlightCaseSensitive={true}/>
                        <Column dataField="name" caption="Grup Adi" />
                        <Column dataField="description" width={120} caption="Açıklama" />
                        <Column dataField="integrationCode" caption="Entegre Kodu" />
                    
                    </DataGrid>
                </div>

            </Popup>
        </React.Fragment>)

}

