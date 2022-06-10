import React, { useEffect, useState } from 'react';
import { usePlReport, useGuide } from '../../../contexts/hooks'
import TreeList, {
    Column,
    SearchPanel,
    Paging, Scrolling
} from 'devextreme-react/tree-list';
import './pl-report.css'
import { TagBox } from 'devextreme-react/tag-box';

import { PlReportDetailModal } from './pl-report-detail-modal'

var currentYear = new Date().getFullYear();
var currentMonth = new Date().getMonth() + 1;
const yearArray = () => {

    let years = [];
    let startYear = 2020;
    while (startYear <= currentYear) {
        years.push(startYear++);
    }
    console.log("years ", years)
    return years;
};
const monthArray = [
    { value: 1, caption: 'Ocak' },
    { value: 2, caption: 'Şubat' },
    { value: 3, caption: 'Mart' },
    { value: 4, caption: 'Nisan' },
    { value: 5, caption: 'Mayıs' },
    { value: 6, caption: 'Haziran' },
    { value: 7, caption: 'Temmuz' },
    { value: 8, caption: 'Ağustos' },
    { value: 9, caption: 'Eylül' },
    { value: 10, caption: 'EKİM' },
    { value: 11, caption: 'Kasım' },
    { value: 12, caption: 'Aralık' },
]

export const PlReport = () => {

    const pl = usePlReport();
    const guide = useGuide();
    const [filterData, setFilterData] = useState({ currency: "USD", year: currentYear, month: currentMonth, projectCode: [] });
    const [dataSource, setDatasource] = useState([]);
    const [projectDataSource, setProjectDatasource] = useState([]);
    const [detailDataSource, setDetailDatasource] = useState([]);
    const [detailOpen, setDetailOpen] = useState(false);


    const fetchFilterData = async () => {
        var _projectData = await guide.getProjeList();
        setProjectDatasource(_projectData.data.filter(x => x.raporKod1 === 'GES'));
    } 

    const fetchData = async () => {
        
        var _resultData = await pl.getPlReport(filterData);
        if (_resultData.data === null) return;

        for (let index = 0; index < _resultData.data.length; index++) {
            _resultData.data[index].differance = _resultData.data[index].actual - _resultData.data[index].budget;
            _resultData.data[index].rate = 
                _resultData.data[index].budget === 0 ? 1 : (_resultData.data[index].actual - _resultData.data[index].budget) / _resultData.data[index].budget;
            _resultData.data[index].actualRate = 
                _resultData.data[index].actual === 0 ? 1 : (_resultData.data[index].actual - _resultData.data[index].lastYearActual) / _resultData.data[index].budget;

            _resultData.data[index].totalDifferance = _resultData.data[index].totalActual - _resultData.data[index].totalBudget;
            _resultData.data[index].totalRate = 
                _resultData.data[index].totalBudget === 0 ? 1 : (_resultData.data[index].totalActual - _resultData.data[index].totalBudget) / _resultData.data[index].totalBudget;
            _resultData.data[index].totalActualRate = 
                _resultData.data[index].totalActual === 0 ? 1 : (_resultData.data[index].totalActual - _resultData.data[index].lastYearTotalActual) / _resultData.data[index].totalBudget;
        }

       
        setDatasource(_resultData.data);
    }

    const fetchDetailData = async (_filter) => {
        var _resultData = await pl.getPlDetail({ ...filterData, ..._filter });

        setDetailDatasource(_resultData.data);
        setDetailOpen(true);
    }

    useEffect(() => {
        fetchFilterData();
    }, []);

    const onToolbarPreparing = (e) => {
        e.toolbarOptions.items.unshift({
            location: 'before',
            widget: 'dxSelectBox',
            locateInMenu: "auto",
            options: {
                width: 75,
                items: yearArray(),
                value: filterData.year,
                onValueChanged: (e) => setFilterData({ ...filterData, year: e.value })
            }
        }, {
            location: 'before',
            widget: 'dxSelectBox',
            locateInMenu: "auto",
            options: {
                width: 75,
                valueExpr: 'value',
                displayExpr: 'caption',

                items: monthArray,
                value: filterData.month,
                onValueChanged: (e) => setFilterData({ ...filterData, month: e.value })
            }
        }, {
            location: 'before',
            widget: 'dxSelectBox',
            locateInMenu: "auto",
            options: {
                width: 75,
                items: ["TL", "USD", "EUR"],
                value: filterData.currency,
                onValueChanged: (e) => setFilterData({ ...filterData, currency: e.value })
            }
        }, {
            location: 'before',
            widget: 'dxButton',
            options: {
                icon: 'search',
                onClick: fetchData
            }
        });
    }

    let maxDisplayProjectTag = window.innerWidth <= 720 ? 2 : (window.innerWidth <= 1000 ? 3 : (window.innerWidth <= 1200 ? 5 : 10))

    const handleTreeCellDblClick = (e) => {
       

        let dataField = e.column.dataField;
        if(dataField==='actual'){
            fetchDetailData({integrationCode: e.data.integrationCode, actualOrBudget : 1, reportCodeId: e.data.id, moment:true});
        }else if (dataField==='totalActual'){
            fetchDetailData({integrationCode: e.data.integrationCode, actualOrBudget : 1, reportCodeId: e.data.id, moment:false});
        }else if (dataField==='lastYearActual'){
            fetchDetailData({integrationCode: e.data.integrationCode, actualOrBudget : 1, reportCodeId: e.data.id, moment:true,year:filterData.year-1});
        }else if (dataField==='lastYearTotalActual'){
            fetchDetailData({integrationCode: e.data.integrationCode, actualOrBudget : 1, reportCodeId: e.data.id, moment:false,year:filterData.year-1});
        }else if (dataField==='budget'){
            fetchDetailData({integrationCode: e.data.integrationCode, actualOrBudget : 2, reportCodeId: e.data.id, moment:true});
        }else if(dataField==='totalBudget'){
            fetchDetailData({integrationCode: e.data.integrationCode, actualOrBudget : 2, reportCodeId: e.data.id, moment:false});
        }else{
            return;
        }
        
        //  console.log('EEEEEEE : ',e)
        //  fetchDetailData();
        
    }

    const handleDatailPopupClose = () =>{
        setDetailOpen(false);
        setDetailDatasource([]);
    }

    return (
        <React.Fragment>
            <PlReportDetailModal open={detailOpen} onClose={handleDatailPopupClose} dataSource={detailDataSource} />
            <h3 className={'content-block'}>{"P&L Rapor"}</h3>
            <div className={'content-block dx-card responsive-paddings'} >
                <TagBox
                    items={projectDataSource}
                    defaultValue={filterData.projectCode}
                    showSelectionControls={true}
                    maxDisplayedTags={maxDisplayProjectTag}
                    showMultiTagOnly={false}
                    applyValueMode="useButtons"
                    placeholder="Proje Seçiniz..."
                    displayExpr="projeAdi"
                    valueExpr="projeKodu"
                    onValueChanged={(e) => setFilterData({ ...filterData, projectCode: e.value })}
                    selectAllMode="allPages" />

                <TreeList
                    id="cash-flow"
                    height={window.innerHeight - (window.innerWidth <= 900 ? 180 : 220)}
                    dataSource={dataSource}
                    rootValue={'0'}
                    wordWrapEnabled={true}
                    allowColumnResizing={true}
                    allowColumnReordering={false}
                    showRowLines={true}
                    showBorders={true}
                    columnAutoWidth={true}
                    selection={{ mode: 'single' }}
                    keyExpr="id"
                    parentIdExpr="parentId"
                    onToolbarPreparing={onToolbarPreparing}
                    onCellDblClick={handleTreeCellDblClick}
                >
                    <SearchPanel visible={true} />
                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={false} />
                    <Column cellRender={cellRender} dataField="descript" caption="Açıklama" dataType="string" />

                    <Column caption={monthArray.find(x=>x.value===filterData.month).caption} alignment="center" cssClass={"total-date"}>
                        <Column cellRender={cellRender} dataField="budget" caption="Bütçe" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        <Column cellRender={cellRender} dataField="actual" caption="Gerç." dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        <Column cellRender={cellRender} dataField="differance" caption="Fark" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        {/* <Column cellRender={cellRender} dataField="rate"                    caption="Oran"          dataType="number"   format={{ type: "fixedPoint", precision: 3 }} /> */}

                        <Column cellRender={cellRender} dataField="lastYearActual" caption={`${filterData.year - 1} Gerç.`} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        {/* <Column cellRender={cellRender} dataField="actualRate"              caption="Gerç. Oran"    dataType="number"   format={{ type: "fixedPoint", precision: 3 }} /> */}
                    </Column>
                    <Column />
                    <Column caption={"Toplam"} alignment="center" cssClass={"total-date"}>
                        <Column cellRender={cellRender} dataField="totalBudget" caption="Bütçe" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        <Column cellRender={cellRender} dataField="totalActual" caption="Gerç." dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        <Column cellRender={cellRender} dataField="totalDifferance" caption="Fark" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />

                        <Column cellRender={cellRender} dataField="lastYearTotalActual" caption={`${filterData.year - 1} Gerç.`} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />

                    </Column>

                </TreeList>
            </div>

        </React.Fragment>)

}



const cellRender = (e) => {

    let colorCode = "";
    if (e.data.colorCode !== null || e.data.colorCode !== undefined || e.data.colorCode !== '') 
        colorCode = e.data.colorCode


    let cellData = e;
    if (e.column.dataField === 'differance') {
        return (
            <div className={e.data.rate > 0 ? 'inc' : 'dec'}>
                <div className="current-value" style={{ color: e.data.colorCode }} >{e.text} </div>
                <div className="diff">{Math.abs((e.data.rate * (100)).toFixed(1))}</div>
            </div>
        )
    } else if (e.column.dataField === 'lastYearActual') {
        return (
            <div className={e.data.rate > 0 ? 'inc' : 'dec'}>
                <div className="current-value" style={{ color: e.data.colorCode }} >{e.text} </div>
                <div className="diff">{Math.abs((e.data.actualRate * (100)).toFixed(1))}</div>
            </div>
        )
    } else if (e.column.dataField === 'totalDifferance') {
        return (
            <div className={e.data.rate > 0 ? 'inc' : 'dec'}>
                <div className="current-value" style={{ color: e.data.colorCode }} >{e.text} </div>
                <div className="diff">{Math.abs((e.data.totalRate * (100)).toFixed(1))}</div>
            </div>
        )
    } else if (e.column.dataField === 'lastYearTotalActual') {
        return (
            <div className={e.data.rate > 0 ? 'inc' : 'dec'}>
                <div className="current-value" style={{ color: e.data.colorCode }} >{e.text} </div>
                <div className="diff">{Math.abs((e.data.totalActualRate * (100)).toFixed(1))}</div>
            </div>
        )
    } else {
        return <div style={{ color: e.data.colorCode }}>{e.text}</div>
    }
}
