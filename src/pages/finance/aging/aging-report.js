import React, { useEffect, useState } from 'react';
import { useAging, useCashFlow } from '../../../contexts/hooks'

import DataGrid, { Column, FilterRow,SearchPanel,Toolbar, Paging, Scrolling, Summary, MasterDetail,Item } from 'devextreme-react/data-grid';
import { SelectBox, Button,DateBox,TextBox,NumberBox,Switch } from 'devextreme-react';

import { yearsStartMinYear, currYear } from '../../../helper'
import { getToday,convertUtcDate,convertUtcDateWithPart } from '../../../helper'
import {AgingMasterDetail} from './aging-master-detail'

const defaultState = {rangeDay:15,cariTip:'S',sector:'ges',currencyCode:'TL'}

export const AgingReport = () => {


    const aging = useAging();

    const [range, setRange]=useState(15);
    const [filter, setFilter] = useState(defaultState);
    const [dataSource, setDatasource] = useState([]);
    

    const fetchData = async () => {
        var _resultData =  await aging.getReport(filter);
        console.log("_resultData : ",_resultData,filter);
        setRange(filter.rangeDay)
        setDatasource(_resultData)  
    } 

  

    


    const cellDoubleClick = (e) => {

      
    }


    return (
        <React.Fragment>
           
            <h3 className={'content-block'}>Yaşlandırma Rapor</h3>
            <div className={'content-block dx-card responsive-paddings'} >
                <DataGrid
                    height={"100%"}
                    dataSource={dataSource}
                    wordWrapEnabled={false}
                    allowColumnResizing={true}
                    allowColumnReordering={false}
                    onCellDblClick={cellDoubleClick}
                    showRowLines={true}
                    showBorders={true}
                    columnAutoWidth={true}
                    selection={{ mode: 'single' }}
                >
                    <MasterDetail
                        enabled={true}
                        render={e=><AgingMasterDetail filter={{...filter,cariKodu:e.key.cariKodu}}/>}
                    />
                    <FilterRow visible={true}></FilterRow>
                    <Scrolling columnRenderingMode="virtual" />
                    <Paging enabled={false} />

                    <Column cellRender={cellRender} fixed={window.innerWidth>900} fixedPosition={"left"} dataField="cariKodu" caption="Cari Kod" dataType="string"  />
                    <Column cellRender={cellRender} fixed={window.innerWidth>900} fixedPosition={"left"} dataField="cariAdi" caption="Cari" dataType="string" />
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
                    <Toolbar>
    
                        <Item key={1} location="before" locateInMenu="auto" >
                            <SelectBox
                                showClearButton={true}
                                items={[{ displayValue: "Otel", valueField: "otel" }, { displayValue: "Ges", valueField: "ges" }, { displayValue: "İnşaat", valueField: "insaat" }]}
                                valueExpr = 'valueField'
                                displayExpr = 'displayValue'
                                placeholder='Şirket Grubu'
                                value={filter.sector}
                                onValueChanged={ (e) => setFilter({...filter,  sector: e.value })} 
                                />
                        </Item>

                        <Item key={2} location="before" locateInMenu="auto">
                            <SelectBox
                                showClearButton={true}
                                width="100"
                                items={["TL", "USD", "EUR"]}
                                value={filter.currencyCode}
                                placeholder='Döviz'
                                onValueChanged={(e) => setFilter({ ...filter, currencyCode: e.value })} />
                        </Item>
                        
                        <Item key={3} location="before" locateInMenu="auto" >
                            <SelectBox
                                items={[{ displayValue: "Alıcı", valueField: "A" }, { displayValue: "Satıcı", valueField: "S" },{ displayValue: "Grup İçi", valueField: "M" },{ displayValue: "Vergi", valueField: "K" }, { displayValue: "Personel", valueField: "T" },{ displayValue: "Diğer", valueField: "D" }]}
                                valueExpr = 'valueField'
                                displayExpr = 'displayValue'
                                placeholder='Cari Tip'
                                value={filter.cariTip}
                                onValueChanged={(e) => setFilter({ ...filter, cariTip: e.value })} />
                        </Item>
                        
                
                        <Item key={4} location="before" locateInMenu="auto">
                            <NumberBox
                                width="60"
                                value={filter.rangeDay}
                                placeholder='Vade'
                                onValueChanged={(e) => setFilter({ ...filter, rangeDay: e.value })} />
                        </Item>
                        <Item key={5} location="before" >
                            <Button
                            stylingMode=  'outlined' // 'contained'
                                type='default'  
                                icon={"search"}
                                text='Ara'
                                onClick={e=>fetchData() } />
                        </Item>

                        <Item key={5} location="before" >
                            <div style={{marginLeft:"5px",marginTop:"7px"}}>
                            <Switch
                                stylingMode=  'outlined' // 'contained'
                                type='default'  
                                icon={"search"}
                                switchedOnText="Sıfır Bak."
                                text='Sıfır Bakiye Göster'
                                />
                            </div>
                           
                        </Item>
                        
                
                    </Toolbar>

                </DataGrid>
            </div>

        </React.Fragment>)

}

const cellRender = (e) => {
    return e.text
}


