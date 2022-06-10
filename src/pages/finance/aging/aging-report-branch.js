import React, { useEffect, useState } from 'react';
import CustomStore from 'devextreme/data/custom_store';
import { useAging } from '../../../contexts/hooks'

import DataGrid, { Column, FilterRow,SearchPanel,Toolbar, Paging, Scrolling, Summary, TotalItem,Item } from 'devextreme-react/data-grid';

export const AgingReportBranch = ({filter}) => {

    const aging = useAging();
    const [data,setData]= React.useState();

    React.useEffect(()=>{
        fetchData();
    },[])
    

    const fetchData = async () =>{
        var res = await aging.getReportBranch(filter);
        setData(res.data);
    } 


    const range=filter.rangeDay;
    return (
        <React.Fragment>
           
                <DataGrid
                    height={"100%"}
                    dataSource={data}
                    allowColumnResizing={true}
                    allowColumnReordering={false}
                    //onCellDblClick={cellDoubleClick}
                    showRowLines={true}
                    showBorders={true}
                    columnAutoWidth={true}
                    selection={{ mode: 'single' }}
                    style={{border:"solid 1px #ff5722"}}
                >
                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={false} />

                    <Column cellRender={cellRender} dataField="subeKodu" caption="Şube Kod" dataType="string"  />
                    <Column cellRender={cellRender} dataField="subeAdi" caption="Şube" dataType="string" />
                    <Column cellRender={cellRender} dataField="bakiye" caption={`Bakiye`} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />

                    <Column caption="Geçmiş" alignment="center">
                        <Column cellRender={cellRender} dataField="lastBakiye4" caption={`~ ${3*range}`} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        <Column cellRender={cellRender} dataField="lastBakiye3" caption={`${3*range} - ${2*range}`} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        <Column cellRender={cellRender} dataField="lastBakiye2" caption={`${2*range} - ${1*range}`} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        <Column cellRender={cellRender} dataField="lastBakiye1" caption={`${1*range} - 0`} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    </Column>
                    <Column caption="Gelecek" alignment="center">
                        <Column cellRender={cellRender} dataField="nextBakiye1" caption={`0 - ${1*range}`} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        <Column cellRender={cellRender} dataField="nextBakiye2" caption={`${1*range} - ${2*range}`} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        <Column cellRender={cellRender} dataField="nextBakiye3" caption={`${2*range} - ${3*range}`} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                        <Column cellRender={cellRender} dataField="nextBakiye4" caption={`${3*range} ~`} dataType="number" format={{ type: "fixedPoint", precision: 0 }} />
                    </Column>
                </DataGrid>

        </React.Fragment>)

}

const cellRender = (e) => {
    return e.text
}


