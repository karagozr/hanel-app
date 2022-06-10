import React, { useEffect, useState } from 'react';
import { useReportCode } from '../../../contexts/hooks'
import TreeList, {
    Column,
    Editing,
    SearchPanel,
    Paging, Scrolling,
    RequiredRule,
    RowDragging, Lookup
} from 'devextreme-react/tree-list';
import ColorBox from "devextreme-react/color-box";
import {ReportCodeGroupModal} from './report-code-group';
import { Template } from 'devextreme-react/core/template';

export const ReportCode = () => {

    const reportCode = useReportCode();
    
    const [reportGroupModalOpen, setReportGroupModalOpen] = useState(false);

    const [dataSource, setDatasource] = useState([]);
    const [deletedDataSource, setDeletedDataSource] = useState([]);
    const [reportGroupDataSource, setReportGroupDataSource] = useState([]);

    const fetchData = async () => {
        var _resultData = await reportCode.getReportCode();
        setDatasource(_resultData.data);
    }


    useEffect(() => {
        fetchData();
    }, []);


    const saveData = async (e) =>{
        var _resultData = await reportCode.editReportCode([...deletedDataSource,...dataSource.filter(x=>x.inserted===true || x.updated===true)]);
    }

    
    const onDragChange = (e) => {
        let visibleRows = e.component.getVisibleRows(),
            sourceNode = e.component.getNodeByKey(e.itemData.id),
            targetNode = visibleRows[e.toIndex].node;

        while (targetNode && targetNode.data) {
            if(targetNode !== undefined)
            if (targetNode.data.id === sourceNode.data.id) {
                e.cancel = true;
                break;
            }
            targetNode = targetNode.parent;
        }
    }

    const setOrderCode = (_data, _parentId, _parentOrder) =>{
        _data.filter(x=>x.parentId === _parentId ).forEach((item,index)=>{
            var orderNum = index+1;
            var oldCode = item.orderCode; 
            var newCode = (_parentOrder===null?"": _parentOrder+"-") + ("000" + orderNum).slice(-3);
            if(oldCode!==newCode){
                item.orderCode=newCode;
                item.updated=true;
            }
            if(_data.filter(x=>x.parentId===item.id).length>0)
                setOrderCode(_data,item.id, item.orderCode);
        })
    }

    const newOrderCode = (_parentId) =>{
        
        var parent = dataSource.find(x=>x.id===_parentId);
        var childrenCount = dataSource.filter(x=>x.parentId===_parentId).length;
        var _orderCode =  childrenCount===0?"001":("000" + childrenCount).slice(-3);

        return parent !== undefined? parent.orderCode+"-"+_orderCode:_orderCode;
    }
    
    const onReorder = (e) => {
       
        const visibleRows = e.component.getVisibleRows();
        let sourceData = e.itemData;
        let _data = dataSource;
        const sourceIndex = _data.indexOf(sourceData);

        if (e.dropInsideItem) {
            
            sourceData = { ...sourceData, parentId: visibleRows[e.toIndex].key };
            _data = [..._data.slice(0, sourceIndex), sourceData, ..._data.slice(sourceIndex + 1)];
        } else {
            const toIndex = e.fromIndex > e.toIndex ? e.toIndex - 1 : e.toIndex;
            let targetData = toIndex >= 0 ? visibleRows[toIndex].node.data : null;

            if (targetData && e.component.isRowExpanded(targetData.id)) {
                sourceData = { ...sourceData, parentId: targetData.id };
                targetData = null;
            } else {
                
                const _parentId = targetData ? targetData.parentId : 0;
               
                if (sourceData.id !== _parentId) {
                    sourceData = { ...sourceData, parentId: _parentId };
                }
            }

            _data = [..._data.slice(0, sourceIndex), ..._data.slice(sourceIndex + 1)];

            const targetIndex = _data.indexOf(targetData) + 1;
            _data = [..._data.slice(0, targetIndex), sourceData, ..._data.slice(targetIndex)];

            
        }
        setOrderCode(_data,0,null);
        setDatasource(_data);
    }

    const updateColor = (e, data) => {
        data.colorCode = e.value;
    }


    const colorEditComponent = (cell) => {
        return (
            <ColorBox defaultValue={cell.value} onValueChanged={(e) => updateColor(e, cell.data)} style={{ color: cell.value }} />
        );
    }

    const cellRender = (e) => {
        var _color = e.row.data.colorCode === null ? "white" : e.row.data.colorCode;
        return <a style={{ color: _color }}>{e.text}</a>;
    }

    const cellRenderColor = (e) => {
        var _color = e.row.data.colorCode === null ? "white" : e.row.data.colorCode;
        return  <a style={{ color: _color }}>{e.text}</a>
    }

    
    const rowInserted = (e) => {

        let _index = dataSource.findIndex(x=>x.id === e.data.id);
        let _parent = dataSource.find(x=>x.id === e.data.parentId);
        let _maxId = dataSource.filter(x=>x.id !== e.data.id).reduce(function(a=0, b) {
            return Math.max(a, b.id);   
        }, 0);

       
       
        dataSource[_index].id=_maxId+1;
        dataSource[_index]={
            ...dataSource[_index],
            parentId:e.data.parentId,
            orderCode:newOrderCode(dataSource[_index].parentId),
            name: e.data.name,
            colorCode:e.data.colorCode!==undefined?e.data.colorCode:(_parent!==undefined?_parent.colorCode:"#f7f7f7"),
            isReportCode:e.data.isReportCode!==undefined?e.data.isReportCode:false,
            integrationCode:e.data.integrationCode!==undefined?e.data.integrationCode:"",
            inserted: true,
            updated: false,
            deleted: false
        } 

        e.component.refresh();
        
    }

    const rowUpdated = (e) =>{
        let _index = dataSource.findIndex(x=>x.id === e.data.id);
        dataSource[_index].updated=true;
    }

    const rowRemoved = (e) =>{
        const _deletedRow = e.data;
        _deletedRow.deleted=true;
        setDeletedDataSource([...deletedDataSource,_deletedRow])
    }

    const onToolbarPreparing = (e) => {
        e.toolbarOptions.items.unshift( {
            location: 'before',
            widget: 'dxButton',
            locateInMenu : "auto", 
            options: {
                text:'Kaydet',
                icon: 'save',
                onClick: saveData
            }
        }, {
            location: 'before',
            widget: 'dxButton',
            locateInMenu : "auto",
            options: {
                text:'Rapor Grupları',
                icon: 'insertrowabove',
                onClick: (e)=>setReportGroupModalOpen(true)
            }
        });
    }

    return (
        <React.Fragment>
            <ReportCodeGroupModal  open={reportGroupModalOpen} onClose={(e)=>setReportGroupModalOpen(false)} data={reportGroupDataSource} title="Rapor Grupları"/>
            <h3 className={'content-block'}>Rapor Kodları - Ekle/Düzenle</h3>
            <div className={'content-block dx-card responsive-paddings'} style={{ height: window.innerHeight * 0.84 }}>
                <TreeList
                    id="cash-flow"
                    height={window.innerHeight - (window.innerWidth <= 900 ? 160 : 200)}
                    dataSource={dataSource}
                    rootValue={0}
                    wordWrapEnabled={true}
                    allowColumnResizing={true}
                    allowColumnReordering={false}
                    showRowLines={true}
                    onRowInserted = {rowInserted}
                    onRowUpdated = {rowUpdated}
                    onRowRemoved = {rowRemoved}
                    showBorders={true}
                    columnAutoWidth={true}
                    selection={{ mode: 'single' }}
                    keyExpr="id"
                    parentIdExpr="parentId"
                    onToolbarPreparing={onToolbarPreparing}
                >
                    <SearchPanel visible={true} />
                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={false} />
                    <RowDragging
                        onDragChange={onDragChange}
                        onReorder={onReorder}
                        allowDropInsideItem={true}
                        allowReordering={true}
                        showDragIcons={true}
                    />
                    <Editing
                        allowAdding={true}
                        allowUpdating={true}
                        allowDeleting={true}
                        mode="cell" />
                    <Column dataField="orderCode" caption="Sıra" dataType="string" allowEditing={false} cellRender={cellRender}></Column>
                    <Column dataField="name" caption="Açıklama" dataType="string" cellRender={cellRender}><RequiredRule /></Column>
                    <Column dataField="colorCode" caption="Renk Kodu" dataType="string" cellRender={cellRenderColor} editCellRender={colorEditComponent} ></Column>
                    <Column dataField="reportGroupId" caption="Rapor Grubu" dataType="string" cellRender={cellRenderColor}  ><Lookup dataSource={["1","2","3"]}></Lookup></Column>
                    <Column dataField="integrationCode1" caption="Entegre Kodu-1" dataType="string" cellRender={cellRender} ></Column>
                    <Column dataField="integrationCode2" caption="Entegre Kodu-2" dataType="string" cellRender={cellRender} ></Column>
                    <Column dataField="integrationCode3" caption="Entegre Kodu-3" dataType="string" cellRender={cellRender} ></Column>
                    <Column dataField="isExpanded" caption="Açık Gelsin" dataType="boolean"  ></Column>
                    <Column dataField="isReportCode" caption="Kod Mu?" dataType="boolean" ></Column>

                </TreeList>
            </div>

        </React.Fragment>)

}



/**

branchCode: "111"
branchName: "FETHİYE ENERJİ-GES ŞB."
differance: -48771
id: 2
isExpanded: false
lastActualCost: 48771.7603
mainCode: "G00"
mainCodeDesc: "Gelirler"
mainGroup: "GELİR"

parentId: "110:P11G00-01"
projectCode: "P11"
projectName: "DEREKÖY"
rate: -1
rootId: "110:P11G00-01:111"
subCode: "G00-01"
subCode2: "G00-01"
subCodeDesc: "Elektrik Satış Gelirleri"
subGroup: "GELİR"
totalActualCost: 375232.3567
totalBudget: 413718
totalDifferance: -38485.6433
totalLastActualCost: 413717.9419
totalRate: -0.093 */

// const onToolbarPreparing = (e) =>{
//     e.toolbarOptions.items.unshift({
//         location: 'after',
//         widget: 'dxSelectBox',
//         options: {
//           width: 60,
//           items: [
//               { value: 'TL' }, 
//               { value: 'USD' },
//               { value: 'EUR' },
//               { value: 'GBP' }
//           ],
//           displayExpr: 'value',
//           valueExpr: 'value',
//           value: 'TL',

//         }
//       },{
//         location: 'after',
//         widget: 'dxSelectBox',
//         options: {
//           width: 100,
//           items: [
//               { value: 2020 }, 
//               { value: 2021 },
//               { value: 2022 },
//               { value: 2023 }
//           ],
//           displayExpr: 'value',
//           valueExpr: 'value',
//           value: 2021,

//         }
//       },{
//         location: 'after',
//         widget: 'dxSelectBox',
//         options: {
//           width: 120,
//           items: [
//               { value: 'GES' }, 
//               { value: 'OTEL' },
//               { value: 'İNŞAAT' }
//           ],
//           displayExpr: 'value',
//           valueExpr: 'value',
//           value: 'GES',

//         }
//       });
// }