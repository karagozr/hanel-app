import React from "react";
import DataGrid, { Column, FilterRow, Paging, Scrolling, Export, Toolbar, Item } from 'devextreme-react/data-grid';
import { Button, SelectBox } from 'devextreme-react';
import { useBudget, usePlReport } from '../../../contexts/hooks'
import { alert } from 'devextreme/ui/dialog';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { BudgetReportFastEditModal } from './budget-report-edit-fast-modal'
import { BudgetEditModal } from './budget-report-edit-modal'
import './budget-report-edit.css'
import { CariGuide, HesapKodLookUp, StokLookUpGuide, ExportExcel, ImportExcel, StokEditModal } from '../../../components'
import {PlReportDetailModal} from '../profit-loss/pl-report-detail-modal'

export const BudgetReportEdit = ({ match }) => {

    const gridTableRef = React.useRef();

    const budget = useBudget();
    const report = usePlReport();
    const { params } = match;

    const [filterData, setFilterData]=React.useState({currencyCode:"USD", year: params.year, projectCode: params.projectCode });
    const [selectedRow, setSelectedRow] = React.useState({});
    const [fastEditOpen, setFastEditOpen] = React.useState(false);
    const [dataSource, setDataSource] = React.useState([]);

    const [exchangeDatasource, setExchangeDatasource] = React.useState([]);
    
    const [editDetailOpen, setEditDetailOpen] = React.useState(false);
    const [reportDetailOpen, setReportDetailOpen] = React.useState(false);
    const [detailDataSource, setDetailDataSource] = React.useState([]);
    const [detailReportDataSource, setReportDetailDatasource] = React.useState([]);
    const [detailOfProjectDataSource, setDetailOfProjectDataSource] = React.useState([]);

    const fetchExchangeData = async () => {
        var _result = await budget.getBudgetExchangeRates({year:params.year});
        setExchangeDatasource(_result.data.filter(x=>x.currencyCode===filterData.currencyCode));
    }


    const fetchData = async () => {

        var _result33 = await budget.getBudgetReportAllProject(filterData);
        console.log("_result33 : ",_result33);
        var _result = await budget.getBudgetReport(filterData);

        _result.data.forEach(item => {

            item.dangerJanuary    = (item.lastActualJanuary  >0 || item.lastBudgetJanuary   >0) && item.budgetJanuary  === 0 
            item.dangerFebruary   = (item.lastActualFebruary >0 || item.lastBudgetFebruary  >0) && item.budgetFebruary === 0
            item.dangerMarch      = (item.lastActualMarch    >0 || item.lastBudgetMarch     >0) && item.budgetMarch    === 0
            item.dangerApril      = (item.lastActualApril    >0 || item.lastBudgetApril     >0) && item.budgetApril    === 0
            item.dangerMay        = (item.lastActualMay      >0 || item.lastBudgetMay       >0) && item.budgetMay      === 0
            item.dangerJune       = (item.lastActualJune     >0 || item.lastBudgetJune      >0) && item.budgetJune     === 0
            item.dangerJuly       = (item.lastActualJuly     >0 || item.lastBudgetJuly      >0) && item.budgetJuly     === 0
            item.dangerAugust     = (item.lastActualAugust   >0 || item.lastBudgetAugust    >0) && item.budgetAugust   === 0
            item.dangerSeptember  = (item.lastActualSeptember>0 || item.lastBudgetSeptember >0) && item.budgetSeptember=== 0
            item.dangerOctober    = (item.lastActualOctober  >0 || item.lastBudgetOctober   >0) && item.budgetOctober  === 0
            item.dangerNovember   = (item.lastActualNovember >0 || item.lastBudgetNovember  >0) && item.budgetNovember === 0
            item.dangerDecember   = (item.lastActualDecember >0 || item.lastBudgetDecember  >0) && item.budgetDecember === 0 

            item.budgetSummary =    item.budgetJanuary   + 
                                    item.budgetFebruary  +
                                    item.budgetMarch     +
                                    item.budgetApril     +
                                    item.budgetMay       +
                                    item.budgetJune      +
                                    item.budgetJuly      +
                                    item.budgetAugust    +
                                    item.budgetSeptember +
                                    item.budgetOctober   +
                                    item.budgetNovember  +
                                    item.budgetDecember;
            
            item.lastBudgetSummary =item.lastBudgetJanuary   + 
                                    item.lastBudgetFebruary  +
                                    item.lastBudgetMarch     +
                                    item.lastBudgetApril     +
                                    item.lastBudgetMay       +
                                    item.lastBudgetJune      +
                                    item.lastBudgetJuly      +
                                    item.lastBudgetAugust    +
                                    item.lastBudgetSeptember +
                                    item.lastBudgetOctober   +
                                    item.lastBudgetNovember  +
                                    item.lastBudgetDecember;

            item.lastActualSummary =item.lastActualJanuary   + 
                                    item.lastActualFebruary  +
                                    item.lastActualMarch     +
                                    item.lastActualApril     +
                                    item.lastActualMay       +
                                    item.lastActualJune      +
                                    item.lastActualJuly      +
                                    item.lastActualAugust    +
                                    item.lastActualSeptember +
                                    item.lastActualOctober   +
                                    item.lastActualNovember  +
                                    item.lastActualDecember;
        });

        setDataSource(_result.data);
        var _result = await budget.getBudgetDetailOfProject(filterData);
        setDetailOfProjectDataSource(_result.data);
        fetchExchangeData();
    }




    React.useEffect(() => {
        fetchData();
    }, [filterData]);


    const fastAddBudgetDetail = async (obj) => {
        console.log("eee : ",obj)
        var selectedRows = gridTableRef.current.instance.getSelectedRowsData();
        if (selectedRows.length === 0) {
            alert("<i>En az 1 adet satır seçmelisiniz !</i>", "Uyarı");
            setFastEditOpen(false);
            return;
        };
        var arr = [];

        if (obj.budgetAmount)
            for (let index = 0; index < selectedRows.length; index++) {
                arr.push(
                    {
                        currencyCode: filterData.currencyCode,
                        description: "Bütçeye göre otomatik ekleme (" + obj.budgetAmount + " "+filterData.currencyCode+")",
                        budgetCode: selectedRows[index].integrationCode,
                        year: params.year,
                        siteCode: selectedRows[index].siteCode,
                        projectCode: selectedRows[index].projectCode,
                        branchCode: selectedRows[index].branchCode,

                        budgetJanuary: selectedRows[index].lastBudgetJanuary + obj.budgetAmount,
                        budgetFebruary: selectedRows[index].lastBudgetFebruary + obj.budgetAmount,
                        budgetMarch: selectedRows[index].lastBudgetMarch + obj.budgetAmount,
                        budgetApril: selectedRows[index].lastBudgetApril + obj.budgetAmount,
                        budgetMay: selectedRows[index].lastBudgetMay + obj.budgetAmount,
                        budgetJune: selectedRows[index].lastBudgetJune + obj.budgetAmount,
                        budgetJuly: selectedRows[index].lastBudgetJuly + obj.budgetAmount,
                        budgetAugust: selectedRows[index].lastBudgetAugust + obj.budgetAmount,
                        budgetSeptember: selectedRows[index].lastBudgetSeptember + obj.budgetAmount,
                        budgetOctober: selectedRows[index].lastBudgetOctober + obj.budgetAmount,
                        budgetNovember: selectedRows[index].lastBudgetNovember + obj.budgetAmount,
                        budgetDecember: selectedRows[index].lastBudgetDecember + obj.budgetAmount
                    });
            }

        if (obj.budgetPercentage)
            for (let index = 0; index < selectedRows.length; index++) {
                arr.push(
                    {
                        currencyCode: filterData.currencyCode,
                        description: "Bütçeye göre otomatik oranlama (" + obj.budgetPercentage + "%)",
                        budgetCode: selectedRows[index].integrationCode,
                        year: params.year,
                        siteCode: selectedRows[index].siteCode,
                        projectCode: selectedRows[index].projectCode,
                        branchCode: selectedRows[index].branchCode,

                        budgetJanuary: selectedRows[index].lastBudgetJanuary * ((100 + obj.budgetPercentage) / 100),
                        budgetFebruary: selectedRows[index].lastBudgetFebruary * ((100 + obj.budgetPercentage) / 100),
                        budgetMarch: selectedRows[index].lastBudgetMarch * ((100 + obj.budgetPercentage) / 100),
                        budgetApril: selectedRows[index].lastBudgetApril * ((100 + obj.budgetPercentage) / 100),
                        budgetMay: selectedRows[index].lastBudgetMay * ((100 + obj.budgetPercentage) / 100),
                        budgetJune: selectedRows[index].lastBudgetJune * ((100 + obj.budgetPercentage) / 100),
                        budgetJuly: selectedRows[index].lastBudgetJuly * ((100 + obj.budgetPercentage) / 100),
                        budgetAugust: selectedRows[index].lastBudgetAugust * ((100 + obj.budgetPercentage) / 100),
                        budgetSeptember: selectedRows[index].lastBudgetSeptember * ((100 + obj.budgetPercentage) / 100),
                        budgetOctober: selectedRows[index].lastBudgetOctober * ((100 + obj.budgetPercentage) / 100),
                        budgetNovember: selectedRows[index].lastBudgetNovember * ((100 + obj.budgetPercentage) / 100),
                        budgetDecember: selectedRows[index].lastBudgetDecember * ((100 + obj.budgetPercentage) / 100)
                    });
            }

        if (obj.actualAmount)
            for (let index = 0; index < selectedRows.length; index++) {
                arr.push(
                    {
                        currencyCode: filterData.currencyCode,
                        description: "Gerçekleşene göre otomatik ekleme (" + obj.actualAmount + ")",
                        budgetCode: selectedRows[index].integrationCode,
                        year: params.year,
                        siteCode: selectedRows[index].siteCode,
                        projectCode: selectedRows[index].projectCode,
                        branchCode: selectedRows[index].branchCode,

                        budgetJanuary: selectedRows[index].lastActualJanuary + obj.actualAmount,
                        budgetFebruary: selectedRows[index].lastActualFebruary + obj.actualAmount,
                        budgetMarch: selectedRows[index].lastActualMarch + obj.actualAmount,
                        budgetApril: selectedRows[index].lastActualApril + obj.actualAmount,
                        budgetMay: selectedRows[index].lastActualMay + obj.actualAmount,
                        budgetJune: selectedRows[index].lastActualJune + obj.actualAmount,
                        budgetJuly: selectedRows[index].lastActualJuly + obj.actualAmount,
                        budgetAugust: selectedRows[index].lastActualAugust + obj.actualAmount,
                        budgetSeptember: selectedRows[index].lastActualSeptember + obj.actualAmount,
                        budgetOctober: selectedRows[index].lastActualOctober + obj.actualAmount,
                        budgetNovember: selectedRows[index].lastActualNovember + obj.actualAmount,
                        budgetDecember: selectedRows[index].lastActualDecember + obj.actualAmount
                    });
            }

        if (obj.actualPercentage)
            for (let index = 0; index < selectedRows.length; index++) {
                arr.push(
                    {
                        currencyCode: filterData.currencyCode,
                        description: "Gerçeleşene göre otomatik oranlama (" + obj.actualPercentage + "%)",
                        budgetCode: selectedRows[index].integrationCode,
                        year: params.year,
                        siteCode: selectedRows[index].siteCode,
                        projectCode: selectedRows[index].projectCode,
                        branchCode: selectedRows[index].branchCode,

                        budgetJanuary: selectedRows[index].lastActualJanuary * ((100 + obj.actualPercentage) / 100),
                        budgetFebruary: selectedRows[index].lastActualFebruary * ((100 + obj.actualPercentage) / 100),
                        budgetMarch: selectedRows[index].lastActualMarch * ((100 + obj.actualPercentage) / 100),
                        budgetApril: selectedRows[index].lastActualApril * ((100 + obj.actualPercentage) / 100),
                        budgetMay: selectedRows[index].lastActualMay * ((100 + obj.actualPercentage) / 100),
                        budgetJune: selectedRows[index].lastActualJune * ((100 + obj.actualPercentage) / 100),
                        budgetJuly: selectedRows[index].lastActualJuly * ((100 + obj.actualPercentage) / 100),
                        budgetAugust: selectedRows[index].lastActualAugust * ((100 + obj.actualPercentage) / 100),
                        budgetSeptember: selectedRows[index].lastActualSeptember * ((100 + obj.actualPercentage) / 100),
                        budgetOctober: selectedRows[index].lastActualOctober * ((100 + obj.actualPercentage) / 100),
                        budgetNovember: selectedRows[index].lastActualNovember * ((100 + obj.actualPercentage) / 100),
                        budgetDecember: selectedRows[index].lastActualDecember * ((100 + obj.actualPercentage) / 100)
                    });
            }

            var _result = await budget.editBudgetDetail(arr);
            fetchData();
            setFastEditOpen(false);

    }

    const fetchDetailReportData = async (_filter) => {
        var _resultData = await report.getPlDetail(_filter);
        console.log('RESULT ::::  ', _filter);
        setReportDetailDatasource(_resultData.data);
        setReportDetailOpen(true);
    }

    const handleCellDblClick = async (e) => {

        console.log("eee : ",e);
        var col=e.column.name;
        var arr = ["101","102","103","104","105","106","107","108","109","110","111","112"];
        var arr2 = ["201","202","203","204","205","206","207","208","209","210","211","212"];
        
        if(arr.find(x=>x===col)){
            fetchDetailReportData({
                    month:parseInt(e.column.name)%100, 
                    actualOrBudget:2, 
                    moment:true,
                    year:filterData.year-1,
                    currency: filterData.currencyCode,
                    integrationCode:e.data.integrationCode,
                    projectCode:[filterData.projectCode],
                    branchCode:e.data.branchCode,
                    siteCode:e.data.siteCode
                })
        }else if(arr2.find(x=>x===col)){
            fetchDetailReportData({
                month:parseInt(e.column.name)%200, 
                actualOrBudget:1, 
                moment:true,
                year:filterData.year-1,
                currency: filterData.currencyCode,
                integrationCode:e.data.integrationCode,
                projectCode:[filterData.projectCode],
                branchCode:e.data.branchCode,
                    siteCode:e.data.siteCode
            })
        }else{
            var _budgetTd = e.data.budgetId;
            // if (_budgetTd === 0) return;
            
            setEditDetailOpen(true);
    
            setSelectedRow(e.data);
    
            var _result = await budget.getBudgetDetail({ currencyCode: e.data.currencyCode, budgetId: _budgetTd });
    
            setDetailDataSource(_result.data);
        }
    }

    const handleClickCloseDetailEdit = (e) =>{
        setEditDetailOpen(false);
        setDetailDataSource([]);
    }

    const setExcelData = async (excelData) => {
        
        var newData = excelData.map(x => ({
            budgetId: x.budgetId===null?0:x.budgetId,
            currencyCode: x.currencyCode,
            description: x.description,
            budgetCode: x.budgetCode,
            year: params.year,
            siteCode: x.siteCode,
            projectCode: params.projectCode,
            branchCode: x.branchCode,
            detailCodes:x.detailCodes,
            budgetJanuary: x.budgetJanuary === undefined ? 0 : x.budgetJanuary,
            budgetFebruary: x.budgetFebruary === undefined ? 0 : x.budgetFebruary,
            budgetMarch: x.budgetMarch === undefined ? 0 : x.budgetMarch,
            budgetApril: x.budgetApril === undefined ? 0 : x.budgetApril,
            budgetMay: x.budgetMay === undefined ? 0 : x.budgetMay,
            budgetJune: x.budgetJune === undefined ? 0 : x.budgetJune,
            budgetJuly: x.budgetJuly === undefined ? 0 : x.budgetJuly,
            budgetAugust: x.budgetAugust === undefined ? 0 : x.budgetAugust,
            budgetSeptember: x.budgetSeptember === undefined ? 0 : x.budgetSeptember,
            budgetOctober: x.budgetOctober === undefined ? 0 : x.budgetOctober,
            budgetNovember: x.budgetNovember === undefined ? 0 : x.budgetNovember,
            budgetDecember: x.budgetDecember === undefined ? 0 : x.budgetDecember
        }));
        
        var _result = await budget.editBudgetDetail(newData);
        fetchData();
        //setFormData({...formData,faturaDetays:dat})
    }

    const saveDetailValue = async () => {

        var newData = detailDataSource.map(x => ({
            budgetId: selectedRow.budgetId,
            currencyCode: x.currencyCode,
            description: x.description,
            budgetCode: selectedRow.integrationCode,
            year: params.year,
            siteCode: selectedRow.siteCode,
            projectCode: selectedRow.projectCode,
            branchCode: selectedRow.branchCode,

            budgetJanuary: x.budgetJanuary === undefined ? 0 : x.budgetJanuary,
            budgetFebruary: x.budgetFebruary === undefined ? 0 : x.budgetFebruary,
            budgetMarch: x.budgetMarch === undefined ? 0 : x.budgetMarch,
            budgetApril: x.budgetApril === undefined ? 0 : x.budgetApril,
            budgetMay: x.budgetMay === undefined ? 0 : x.budgetMay,
            budgetJune: x.budgetJune === undefined ? 0 : x.budgetJune,
            budgetJuly: x.budgetJuly === undefined ? 0 : x.budgetJuly,
            budgetAugust: x.budgetAugust === undefined ? 0 : x.budgetAugust,
            budgetSeptember: x.budgetSeptember === undefined ? 0 : x.budgetSeptember,
            budgetOctober: x.budgetOctober === undefined ? 0 : x.budgetOctober,
            budgetNovember: x.budgetNovember === undefined ? 0 : x.budgetNovember,
            budgetDecember: x.budgetDecember === undefined ? 0 : x.budgetDecember
        }));

        await budget.editBudgetDetail(newData);
        setEditDetailOpen(false);
        fetchData();
    }

    return (
        <React.Fragment>
            <BudgetReportFastEditModal open={fastEditOpen} onClose={e => setFastEditOpen(false)} saveData={fastAddBudgetDetail} />
            <BudgetEditModal open={editDetailOpen} onClose={handleClickCloseDetailEdit} dataSource={detailDataSource} generalData={selectedRow} saveData={saveDetailValue} exchangeDatasource={exchangeDatasource} />
            <PlReportDetailModal open={reportDetailOpen} onClose={() =>{
                setReportDetailOpen(false);
                setReportDetailDatasource([]);
            }} dataSource={detailReportDataSource} />
            <h3 className={'content-block'}>Bütçe Raporla ve Düzenle</h3>

            <div className={'content-block dx-card responsive-paddings'}>
                <DataGrid
                    className={"budgetGrid"}
                    rowAlternationEnabled={true}
                    selection={{ mode: 'single', color: 'red' }}
                    showBorders={true}
                    height={parseInt((window.innerHeight - 240))}
                    columnHidingEnabled={true}
                    allowColumnResizing={true}
                    columnResizingMode={"widget"}
                    selection={{ mode: 'multiple', color: 'red', selectAllMode: 'allPages', showCheckBoxesMode: 'onClick' }}
                    // columnMinWidth={50}
                    // columnMaxWidth={150}
                    onExporting={onExporting}
                    onCellDblClick={handleCellDblClick}
                    columnAutoWidth={true}
                    width={'100%'}
                    ref={gridTableRef}
                    dataSource={dataSource}
                >

                    <Scrolling columnRenderingMode="virtual" />
                    <Column tabIndex={-1} fixed={true} fixedPosition={"left"} dataField={'integrationCode'} caption={'Kod'} dataType={'string'} style={{ textAlign: 'right' }} />
                    <Column tabIndex={-1} fixed={true} fixedPosition={"left"} dataField={'name'} caption={'Açıklama'} dataType={'string'} style={{ textAlign: 'right' }} />
                    <Column tabIndex={-1} dataField={'branchName'} caption={'Şube'} dataType={'string'} style={{ textAlign: 'right' }} />
                    <Column tabIndex={-1} dataField={'siteCode'} caption={'Tesisat'} dataType={'string'} style={{ textAlign: 'right' }} />

                    <Column caption="Ocak" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetJanuary'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} 
                        
                            cellRender={e=>e.row.data.dangerJanuary?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}
                            
                        />
                        <Column tabIndex={-1} name={"101"} dataField={'lastBudgetJanuary'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"201"} dataField={'lastActualJanuary'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    <Column caption="Şubat" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetFebruary'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} 
                        cellRender={e=>e.row.data.dangerFebruary?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}
                        />
                        <Column tabIndex={-1} name={"102"} dataField={'lastBudgetFebruary'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"202"} dataField={'lastActualFebruary'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    <Column caption="Mart" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetMarch'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} 
                        cellRender={e=>e.row.data.dangerMarch?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}
                        />
                        <Column tabIndex={-1} name={"103"} dataField={'lastBudgetMarch'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"203"} dataField={'lastActualMarch'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    <Column caption="Nisan" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetApril'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} 
                        cellRender={e=>e.row.data.dangerApril?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}/>
                        <Column tabIndex={-1} name={"104"} dataField={'lastBudgetApril'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"204"} dataField={'lastActualApril'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    <Column caption="Mayıs" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetMay'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} 
                        cellRender={e=>e.row.data.dangerMay?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}/>
                        <Column tabIndex={-1} name={"105"} dataField={'lastBudgetMay'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"205"} dataField={'lastActualMay'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    <Column caption="Haziran" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetJune'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} 
                        cellRender={e=>e.row.data.dangerJune?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}/>
                        <Column tabIndex={-1} name={"106"} dataField={'lastBudgetJune'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"206"} dataField={'lastActualJune'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    <Column caption="Temmuz" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetJuly'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} 
                        cellRender={e=>e.row.data.dangerJuly?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}/>
                        <Column tabIndex={-1} name={"107"} dataField={'lastBudgetJuly'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"207"} dataField={'lastActualJuly'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    <Column caption="Ağustos" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetAugust'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} 
                        cellRender={e=>e.row.data.dangerAugust?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}/>
                        <Column tabIndex={-1} name={"108"} dataField={'lastBudgetAugust'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"208"} dataField={'lastActualAugust'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    
                    <Column caption="Eylül" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetSeptember'} caption={'Bütçe'}   dataType="number"   format={{ type: "fixedPoint", precision: 0 }} 
                        cellRender={e=>e.row.data.dangerSeptember?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}/>
                        <Column tabIndex={-1} name={"109"} dataField={'lastBudgetSeptember'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"209"} dataField={'lastActualSeptember'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    
                    <Column caption="Ekim" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetOctober'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} 
                        cellRender={e=>e.row.data.dangerOctober?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}/>
                        <Column tabIndex={-1} name={"110"} dataField={'lastBudgetOctober'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"210"} dataField={'lastActualOctober'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    
                    <Column caption="Kasım" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetNovember'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} 
                        cellRender={e=>e.row.data.dangerNovember?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}/>
                        <Column tabIndex={-1} name={"111"} dataField={'lastBudgetNovember'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"211"} dataField={'lastActualNovember'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    
                    <Column caption="Aralık" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetDecember'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} 
                        cellRender={e=>e.row.data.dangerDecember?<div style={{color:"#f44336"}}>{e.text}</div> : e.text}/>
                        <Column tabIndex={-1} name={"112"} dataField={'lastBudgetDecember'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"212"} dataField={'lastActualDecember'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>
                    
                    <Column caption="TOPLAM" alignment="center">
                        <Column tabIndex={-1} dataField={'budgetSummary'} caption={'Bütçe'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        <Column tabIndex={-1} name={"100"} dataField={'lastBudgetSummary'} caption={'Geç.Büt.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-budget"} />
                        <Column tabIndex={-1} name={"200"} dataField={'lastActualSummary'} caption={'Geç.Ger.'} dataType="number" format={{ type: "fixedPoint", precision: 0 }} cssClass={"budget-report last-actual"} />
                    </Column>

                    <FilterRow visible={true}></FilterRow>

                    {/* <StateStoring enabled={true} type="custom" customLoad={loadCustomGridState} customSave={saveCustomGridState} /> */}

                    <Toolbar>
                        <Item location="before">
                            <SelectBox id="custom-templates"
                                dataSource={['TL', 'USD', 'EUR']}
                                onValueChanged={(e)=>setFilterData({...filterData, currencyCode:e.value})}
                                defaultValue={'USD'}
                            />
                        </Item>
                        <Item location="before">
                            <Button type={"danger"} stylingMode="text" name="add-budget-detail" icon="add" text="Toplu bütçe ekle" onClick={(e) => setFastEditOpen(true)} />
                        </Item>
                        <Item location="before">
                            <ExportExcel
                                fileName={"Bütçe şablonu"}
                                data={detailOfProjectDataSource}
                                columns={excelColumns}
                                buttonRender={(<Button type={"success"} stylingMode="text" name="add-budget-detail" icon="xlsxfile" text="Excel İndİr" />)}
                            />
                        </Item>
                        {/* <Item location="before">
                            <Button type={"success"} stylingMode="text" name="add-budget-detail" icon="xlsxfile" text="Excel İndİr" />
                        </Item> */}
                        <Item name="exportButton" location="after" />
                    </Toolbar>
                    <Export enabled={true} />
                </DataGrid>
                <ImportExcel textVisible={true} setResult={setExcelData}  columns={excelColumns} />
            </div>
        </React.Fragment>
    )
}

const excelColumns = [
    //{ label: "Bütçe Id",        value: "budgetId" }, 
    { label: "Kod",             value: "budgetCode" }, 
    { label: "Kod Açıklama",    value: "name" }, 
    { label: "Şube Kodu",       value: "branchCode" },
    { label: "Şube Adı",        value: "branchName" },
    { label: "Tesisat No",      value: "siteCode" },
    { label: "Döviz",           value: "currencyCode" },
    { label: "Kalem Açıklama",  value: "description" },
    { label: "Ocak",            value: "budgetJanuary"},  
    { label: "Şubat",           value: "budgetFebruary"},  
    { label: "Mart",            value: "budgetMarch"},  
    { label: "Nisan",           value: "budgetApril"},  
    { label: "Mayıs",           value: "budgetMay"},  
    { label: "Haziran",         value: "budgetJune"},  
    { label: "Temmuz",          value: "budgetJuly"},  
    { label: "Ağustos",         value: "budgetAugust"},  
    { label: "Eylül",           value: "budgetSeptember"},  
    { label: "Ekim",            value: "budgetOctober"},  
    { label: "Kasım",           value: "budgetNovember"},  
    { label: "Aralık",          value: "budgetDecember"} ,
    //{ label: "Kayıt Numarası",  value: "detailCodes"} ,
]


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