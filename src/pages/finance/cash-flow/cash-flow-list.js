import React, { useEffect, useState } from 'react';
import { useCashFlow } from '../../../contexts/hooks'
import TreeList, {
    Column,
    //StateStoring,FilterRow, ColumnChooser, HeaderFilter, 
    SearchPanel,
    Paging, Scrolling,
    Toolbar,Item
} from 'devextreme-react/tree-list';
import { SelectBox, Button,DateBox } from 'devextreme-react';
import { CashFlowDetailModal } from './cash-flow-detail-modal';
import { yearsStartMinYear, currYear } from '../../../helper'
import { getToday,convertUtcDate,convertUtcDateWithPart } from '../../../helper'

export const CashFlow = ({ match }) => {


    const cash = useCashFlow();
    var stateOfFilter = JSON.parse(localStorage.getItem('cash-flow-filter-data')) === null ? { year: currYear, currencyCode: 'USD' } : JSON.parse(localStorage.getItem('cash-flow-filter-data'))
    const [filterData, setFilterData] = useState(stateOfFilter);
    const [dataSource, setDatasource] = useState([]);
    const [kisit, setKisit]=React.useState("-")
    const [detailDataSource, setDetailDatasource] = useState([]);
    const [detailOpen, setDetailOpen] = useState(false);

    const refDate1=React.useRef();

    const fetchData = async () => {
        localStorage.setItem('cash-flow-filter-data', JSON.stringify({...filterData,date1:filterData.date1 && convertUtcDate(filterData.date1),date2:filterData.date1 && convertUtcDate(filterData.date2) }));
        var _resultData = await cash.getList({...filterData,date1:filterData.date1 && convertUtcDate(filterData.date1),date2:filterData.date1 && convertUtcDate(filterData.date2) });
        //console.log("_resultData : ",_resultData);
        setDatasource(_resultData.data);
        setKisit(
            (filterData.date1&&( ((new Date(filterData.date1)).getDate()) +"/"+((new Date(filterData.date1)).getMonth()+1))) + " - " +
            (filterData.date2&&( ((new Date(filterData.date2)).getDate()) +"/"+((new Date(filterData.date2)).getMonth()+1)))
        );
    }

    const fetchDetailData = async (refCode, month, title) => {
        var _resultData = await cash.getDetail({ ...filterData, refCode: refCode, month: month });
       
        setDetailDatasource({data:_resultData.data, title:title});
    }

    useEffect(() => {
        //fetchData();
    }, [filterData]);

    const toolbarItemRender = () => {
        return (
            <div className="informer">
                <span className="name">-</span>
            </div>
        );
    }

    const cellDoubleClick = (e) => {

        if (e.column.dataField === "ocak" || e.column.dataField === "subat"
            || e.column.dataField === "mart" || e.column.dataField === "nisan"
            || e.column.dataField === "mayis" || e.column.dataField === "haziran"
            || e.column.dataField === "temmuz" || e.column.dataField === "agustos"
            || e.column.dataField === "eylul" || e.column.dataField === "ekim"
            || e.column.dataField === "kasim" || e.column.dataField === "aralik") {
            if (e.row.data.referansKodu > 1000 && e.row.data.referansKodu !== 9990 && e.row.data.referansKodu !== 5000) {
                
                var refKod = e.row.data.referansKodu;
                var month = parseInt(e.column.name);

                fetchDetailData(refKod, month, e.row.data.referansAdi);
                setDetailOpen(true);
            }
        }else if(e.column.dataField === "kisit"){
            if (e.row.data.referansKodu > 1000 && e.row.data.referansKodu !== 9990 && e.row.data.referansKodu !== 5000) {
                
                var refKod = e.row.data.referansKodu;

                fetchDetailData(refKod, 0,  e.row.data.referansAdi);
                setDetailOpen(true);
            }
        }
    }


    return (
        <React.Fragment>
            <CashFlowDetailModal open={detailOpen} onClose={(e) => setDetailOpen(false)} data={detailDataSource.data} title={detailDataSource.title} />
            <h3 className={'content-block'}>Nakit Akış</h3>
            <div className={'content-block dx-card responsive-paddings'} >
                <TreeList
                    id="cash-flow"
                    height={"100%"}
                    dataSource={dataSource}
                    rootValue={-1}
                    wordWrapEnabled={true}
                    allowColumnResizing={true}
                    allowColumnReordering={false}
                    onCellDblClick={cellDoubleClick}
                    showRowLines={true}
                    showBorders={true}
                    columnAutoWidth={true}
                    selection={{ mode: 'single' }}
                    keyExpr="referansKodu"
                    parentIdExpr="grupRefKodu"
                >
                    <SearchPanel visible={true} />
                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={false} />
                    <Column cellRender={cellRender} fixed={window.innerWidth>900} fixedPosition={"left"} dataField="referansKodu" caption="Ref. Kod" dataType="number" width={100} />
                    <Column cellRender={cellRender} fixed={window.innerWidth>900} fixedPosition={"left"} dataField="referansAdi" caption="Açıklama" dataType="string" width={300} />
                    <Column cellRender={cellRender} width={100} dataField="kisit" caption={kisit} dataType="number" format={{ type: "fixedPoint", precision: 0 }} minWidth={80} />
                    <Column cellRender={cellRender} width={85} dataField="ocak" name="1" caption="Ocak" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={85} dataField="subat" name="2" caption="Şubat" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={85} dataField="mart" name="3" caption="Mart" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={85} dataField="nisan" name="4" caption="Nisan" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={85} dataField="mayis" name="5" caption="Mayıs" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={85} dataField="haziran" name="6" caption="Haziran" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={85} dataField="temmuz" name="7" caption="Temmuz" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={85} dataField="agustos" name="8" caption="Ağustos" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={85} dataField="eylul" name="9" caption="Eylül" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={85} dataField="ekim" name="10" caption="Ekim" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={85} dataField="kasim" name="11" caption="Kasım" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={85} dataField="aralik" name="12" caption="Aralık" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Column cellRender={cellRender} width={100} dataField="toplam"  caption="Toplam" dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    <Toolbar>
    
                        <Item location="before" locateInMenu="auto">
                            <SelectBox
                                width="75"
                                items={["TL", "USD", "EUR"]}
                                value={filterData.currencyCode}
                                placeholder='döviz'
                                onValueChanged={(e) => setFilterData({ ...filterData, currencyCode: e.value })} />
                        </Item>

                        <Item location="before" locateInMenu="auto" >
                            <SelectBox
                                width="100"
                                items={[{ displayValue: "OTEL", valueField: "otel" }, { displayValue: "GES", valueField: "ges" }, { displayValue: "İNŞAAT", valueField: "insaat" }]}
                                valueExpr = 'valueField'
                                displayExpr = 'displayValue'
                                placeholder='sektör'
                                value={filterData.sectorName}
                                onValueChanged={(e) => setFilterData({ ...filterData, sectorName: e.value })} />
                        </Item>

                        

                        <Item location="before" locateInMenu="auto">
                            <SelectBox
                                width="75"
                                items={yearsStartMinYear(2020)}
                                value={filterData.year}
                                placeholder='yıl'
                                onValueChanged={(e)=>{
                                    
                                    var _fDate1 = filterData.date1 && new Date(filterData.date1); 
                                    var _fDate2 = filterData.date1 && new Date(filterData.date2); 

                                    var _date1 = filterData.date1 ? convertUtcDateWithPart(e.value, _fDate1.getMonth(),_fDate1.getDate()) : null;
                                    var _date2 = filterData.date2 ? convertUtcDateWithPart(e.value, _fDate2.getMonth(),_fDate2.getDate()) : null;
                
                                    setFilterData({
                                        ...filterData,
                                        date1: _date1,
                                        date2: _date2,
                                        year: e.value
                                    })
                                }} />
                        </Item>
                        <Item location="before" locateInMenu="auto">
                            <div className="informer">
                                <span className="name"> - </span>
                            </div>
                        </Item>

                        <Item location="before" locateInMenu="auto">
                            <DateBox
                                width = "90"
                                displayFormat = "dd/MM"
                                value={filterData.date1}
                                min = {new Date(filterData.year, 0, 1)}
                                max = {filterData.date2?filterData.date2:new Date(filterData.year, 11, 31)}
                                placeholder='tarih-1'
                                onValueChanged={(e) => {
                                    setFilterData({ ...filterData, date1: e.value })
                                }} />

                        </Item>

                        <Item location="before" locateInMenu="auto">
                            <DateBox
                                width = "90"
                                displayFormat = "dd/MM"
                                value={filterData.date2}
                                min = {filterData.date1}
                                max = {new Date(filterData.year, 11, 31)}
                                placeholder='tarih-2'
                                onValueChanged={(e) => 
                                    setFilterData({ ...filterData, date2:e.value  })
                                } />
                        </Item>

                        <Item location="before" >
                            <Button
                                type='default'  
                                icon={"search"}
                                onClick={e=>fetchData() } />
                        </Item>
                
                    </Toolbar>

                </TreeList>
            </div>

        </React.Fragment>)

}

const cellRender = (e) => {
    if (e.data.referansKodu === 1000)
        return <div style={{ color: "#8afb88f2" }}>{e.text}</div>
    else if (e.data.referansKodu > 1000 && e.data.referansKodu < 5000)
        return <div style={{ color: "#c0fbbff2" }}>{e.text}</div>
    if (e.data.referansKodu === 5000)
        return <div style={{ color: "#ff5722" }}>{e.text}</div>
    else if (e.data.referansKodu > 5000 && e.data.referansKodu < 10000 && e.data.referansKodu !== 9990)
        return <div style={{ color: "#ff855f" }}>{e.text}</div>
    else if (e.data.referansKodu === 9990)
        return <div style={{ color: "#8ee8fd" }}>{e.text}</div>
    else if (e.data.referansKodu === 1)
        return <div style={{ color: "#f0f792" }}>{e.column.dataField === "referansKodu" ? "000" : ""}{e.text}</div>
    else if (e.data.referansKodu > 40000 &&  e.data.referansKodu%10===0)
        return <div style={{ color: "#ff855f" }}>{e.text}</div>
    else if (e.data.referansKodu > 40000 )
        return <div style={{ color: "#ff855f" }}>{e.text}</div>
    else
        return <div style={{ color: "#faa9ff" }}>{e.text}</div>
    

}


