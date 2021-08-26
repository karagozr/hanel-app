import React , {useEffect, useState} from 'react';
import {useCashFlow } from '../../contexts/hooks'
import TreeList, { Column, 
    //StateStoring,FilterRow, ColumnChooser, HeaderFilter, 
    SearchPanel, 
    //Selection, Lookup 
} from 'devextreme-react/tree-list';

import { Template } from 'devextreme-react/core/template';
//import { Toolbar, Item } from 'devextreme-react/toolbar';

export const CashFlow = ()=>{

    const cash = useCashFlow();
    const [dataSource, setDatasource] = useState([]);
    useEffect(() => {

        async function fetchData() {

            var _resultData = await cash.getList();
            console.log('_resultData : ', _resultData)
            setDatasource(_resultData.data);
        }

        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toolbarItemRender = () => {
        return (
          <div className="informer">
            <h2 className="count">{31}</h2>
            <span className="name">31 - Total Count</span>
          </div>
        );
      }

    return(
    <React.Fragment>
   
        <h3 className={'content-block'}>Nakit Akış</h3>
        <div className={'content-block dx-card responsive-paddings'} style={{height:window.innerHeight*0.84}}>

            <TreeList
                id="cash-flow"
                height={"100%"}
                dataSource={dataSource}
                rootValue={-1}
                wordWrapEnabled={true}
                allowColumnResizing={true}
                allowColumnReordering={false}
                //defaultExpandedRowKeys={expandedRowKeys}
                //onToolbarPreparing={onToolbarPreparing}
                showRowLines={true}
                showBorders={true}
                columnAutoWidth={true}
                keyExpr="ReferansKodu"
                parentIdExpr="GrupRefKodu" >
            {/* <FilterRow visible={true} /> */}
            <SearchPanel visible={true} />
            {/* <HeaderFilter visible={true} /> */}
            {/* <StateStoring enabled={true} type="localStorage" storageKey="cashFlowLayoutStorage" /> */}
            
            <Template name="totalGroupCount" render={toolbarItemRender} />

            <Column dataField="ReferansKodu" caption="Ref. Kod"  dataType="number" fixed={true} width={100}/>
            <Column dataField="ReferansAdi"  caption="Açıklama"  dataType="string" width={window.innerWidth<900? window.innerWidth*0.3:250} fixed={true}/>
            <Column dataField="Ocak"    caption="Ocak"     dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
            <Column dataField="Subat"   caption="Şubat"    dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
            <Column dataField="Mart"    caption="Mart"     dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
            <Column dataField="Nisan"   caption="Nisan"    dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
            <Column dataField="Mayis"   caption="Mayıs"    dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
            <Column dataField="Haziran" caption="Haziran"  dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
            <Column dataField="Temmuz"  caption="Temmuz"   dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
            <Column dataField="Agustos" caption="Ağustos"  dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
            <Column dataField="Eylul"   caption="Eylül"    dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
            <Column dataField="Ekim"    caption="Ekim"     dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
            <Column dataField="Kasim"   caption="Kasım"    dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
            <Column dataField="Aralik"  caption="Aralık"   dataType="number" format={{ type: "fixedPoint", precision: 0 }} />

            
            </TreeList>
        </div>
        
    </React.Fragment>)
    
}



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