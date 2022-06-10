import React, { useEffect, useState } from 'react';
import { useCashFlow } from '../../../contexts/hooks'
import { useHistory } from "react-router-dom";
import { Popup } from 'devextreme-react/popup';
import DataGrid, { Column, Scrolling, Paging, Summary, TotalItem,SearchPanel,Export } from 'devextreme-react/data-grid';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';

export const CashFlowDetailModal = ({ open, onClose, data, title }) => {

    const [contentHeight, setContentHeight] = useState(0);

    return (
        <React.Fragment>
            <Popup
                visible={open}
                onHiding={onClose}
                dragEnabled={true}
                closeOnOutsideClick={false}
                showTitle={true}
                resizeEnabled={true}
                defaultWidth={window.innerWidth > 1000 ? window.innerWidth * 0.9 : window.innerWidth * 0.95}
                defaultHeight={window.innerHeight * 0.95}
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

                        <Scrolling columnRenderingMode="virtual" />
                        <Paging enabled={true} />
                        <SearchPanel visible={true} highlightCaseSensitive={true}/>
                        <Column fixed={true} fixedPosition={"left"} dataField="tarih" width={100} caption="Tarih" dataType='date' />
                        <Column dataField="hesapAdi" caption="Hesap" />
                        <Column dataField="hesapKodu" width={120} caption="Hesap Kodu" />
                        <Column dataField="aciklama" caption="Açıklama" />
                        <Column dataField="projeAdi" caption="Proje" />
                        <Column dataField="cariAdi" caption="Cari" />
                        <Column dataField="cariKodu" caption="Cari Kodu" />
                        <Column dataField="kullanici" caption="K.Kullanıcı" />
                        <Column dataField="tutar" width={150} caption="Tutar" dataType='number' format={{ type: "fixedPoint", precision: 2 }} cellRender={(e) => e.value === 0 ? "" : e.text} />
                        <Summary>
                            <TotalItem
                                column="tutar"
                                summaryType="sum"
                                displayFormat="Top.: {0}"
                                valueFormat="fixedPoint" />
                        </Summary>

                        <Export enabled={true} />
                    </DataGrid>
                </div>

            </Popup>
        </React.Fragment>)

}



const onExporting= (e) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Budget');

    worksheet.columns = [
      { width: 5 }, { width: 30 }, { width: 25 }, { width: 15 }, { width: 25 }, { width: 40 },
    ];

    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Budget.xlsx');
        });
      });
      e.cancel = true;
  }