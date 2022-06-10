import React from 'react'
import PropTypes from 'prop-types'
import { DataGrid } from 'devextreme-react';
import { Column, Paging, Scrolling, Summary, TotalItem } from 'devextreme-react/data-grid';
import './home-info-grid.css'

export const InfoGrid = (props) => 
{
  const { data, caption,dataField,onRowClick,years } = props;

  return (
  <div className={'dx-card'} style={{ paddingBottom: '10px', marginLeft: "auto", marginRight: "auto", textAlign: "center"}}>  
  <div style={{ marginLeft: "5px", marginRight: "5px" }}>
    <DataGrid
      className={"info-grid"}
      dataSource={data}
      allowColumnReordering={true}
      showBorders={false}
      rowAlternationEnabled={true}
      columnAutoWidth={true}
      columnResizingMode={true}
      selection={{ mode: 'single' }}
      onRowClick={e=>onRowClick({caption:caption,dataField:dataField,data:e.data})}
      //columnHidingEnabled={true}
      height={`${window.innerHeight*0.45}px`}>

      <Scrolling columnRenderingMode="virtual" />
      <Paging enabled={false} />

      <Column dataField="description" caption="Açıklama" />
      <Column cssClass="odd-col" dataField="pax" caption="Pax" alignment={"center"}>
        <Column cssClass="odd-col blue-col" dataField="pax" caption={years.year1}  format={{ type: "fixedPoint", precision: 0 }} cellRender={(e) => e.value === 0 ? "" : e.text} />
        <Column cssClass="odd-col green-col" dataField="pax2" caption={years.year2}  format={{ type: "fixedPoint", precision: 0 }} cellRender={(e) => e.value === 0 ? "" : e.text} />
        <Column cssClass="odd-col" dataField="paxRate"  caption="%" width={75} alignment={"right"}  cellRender={cellRender}/>
      </Column>
      <Column caption="Oda" alignment={"center"}>
        <Column cssClass="blue-col" dataField="pax" caption={years.year1}  format={{ type: "fixedPoint", precision: 0 }} cellRender={(e) => e.value === 0 ? "" : e.text} />
        <Column cssClass="green-col" dataField="pax2" caption={years.year2}  format={{ type: "fixedPoint", precision: 0 }} cellRender={(e) => e.value === 0 ? "" : e.text} />
        <Column dataField="paxRate" caption="%"  width={75} alignment={"right"} cellRender={cellRender}/>
      </Column>
      <Column cssClass="odd-col" caption="Gelir (EUR)" alignment={"center"}>
        <Column cssClass="odd-col blue-col" dataField="incomeSumEUR" caption={years.year1} dataType='number' format={{ type: "fixedPoint", precision: 0 }} cellRender={(e) => e.value === 0 ? "" : e.text} />
        <Column cssClass="odd-col green-col" dataField="incomeSumEUR2" caption={years.year2} dataType='number' format={{ type: "fixedPoint", precision: 0 }} cellRender={(e) => e.value === 0 ? "" : e.text} />
        <Column cssClass="odd-col" dataField="incomeSumEURRate" width={75} alignment={"right"} caption="%"  cellRender={cellRender}/>
      </Column>
      <Column caption="P.P."  alignment={"center"}>
        <Column cssClass="blue-col" dataField="pp" caption={years.year1} dataType='number' format={{ type: "fixedPoint", precision: 1 }}  cellRender={(e) => e.value === 0 ? "" : e.text} />
        <Column cssClass="green-col" dataField="pp2" caption={years.year2}  dataType='number' format={{ type: "fixedPoint", precision: 1 }} cellRender={(e) => e.value === 0 ? "" : e.text} />
        <Column dataField="ppRate" caption="%"  width={75} alignment={"right"} cellRender={cellRender}/>
      </Column>
      <Column cssClass="odd-col" caption="" alignment={"center"} >
        <Column cssClass="odd-col blue-col" dataField="occupancy" caption={years.year1} dataType='number' format={{ type: "fixedPoint", precision: 2 }}  cellRender={(e) => e.value === 0 ? "" : e.text+' %'} />
        <Column cssClass="odd-col green-col" dataField="occupancy2" caption={years.year2}  dataType='number' format={{ type: "fixedPoint", precision: 2 }} cellRender={(e) => e.value === 0 ? "" : e.text+' %'} />
        <Column cssClass="odd-col" dataField="occupancyRate" width={75} alignment={"right"} caption="%"  cellRender={cellRender}/>
      </Column>

      {/* <Summary>
        <TotalItem column="pax" summaryType="sum" displayFormat="{0}" valueFormat="fixedPoint" style={{color:"#8ee8fd"}}/>
        <TotalItem column="roomSum" summaryType="sum" displayFormat="{0}" valueFormat="fixedPoint" cssClass="home-dash-sum"/>
        <TotalItem column="incomeSumEUR" summaryType="sum" displayFormat="{0}" valueFormat="fixedPoint" cssClass="home-dash-sum"/>
      </Summary> */}

    </DataGrid>
  </div>

</div>)}

const cellRender = (e)=>{

    if(e.value<0)
        return <div className='negative-col'>
            <div className='percent-icon'></div>
            <div className='percent-col'>
                {e.value}
            </div> 
        </div>
        
    else if(e.value>0)
         return <div className='positive-col'>
            <div className='percent-icon'></div>
            <div className='percent-col'>
                {e.value}
            </div> 
        </div>
    else
        return <div className='percent-col'>
             {e.value}
        </div>
}

InfoGrid.propTypes = {}


