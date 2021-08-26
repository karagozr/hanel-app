import React from "react";
import { useHotelData } from '../../../contexts/hooks'
import RangeSelector, {
  Size,
  Chart as ChartOptions,
  Margin,
  Scale,
  Label as RLabel,
  Behavior,
  CommonSeriesSettings as CommonSeriesSettingsOptions,
  Series as RsChartSeries
} from 'devextreme-react/range-selector';
import PieChart, {
  Series,
  Label,
  Legend,
  Font,
  Connector,
  Tooltip,
  SmallValuesGrouping,
  ScrollBar,
  ZoomAndPan
} from 'devextreme-react/pie-chart';
import ScrollView from 'devextreme-react/scroll-view';
import './dashboard-hote-agent.css'
import SelectBox from 'devextreme-react/select-box';
import {TreeChart, RangeSelectorChart} from '../../../components';

var now = new Date();
const dateFilter1 = new Date(now.getFullYear(), now.getMonth(), 1);
const dateFilter2 = now.getMonth() === 11 ? new Date(now.getFullYear() + 1, 0, 1) : new Date(now.getFullYear(), now.getMonth() + 1, 1);


export const HotelDashboardAgent = () => {
  const hotel = useHotelData();
  const [hotelData, setHotelData] = React.useState([]);
  const [hotelRangeData, setHotelRangeData] = React.useState([]);
  const [hotelAgentData, setHotelAgentData] = React.useState([]);
  const [hotelCountryData, setHotelCountryData] = React.useState([]);
  const [rangeDate, setRangeDate]=React.useState([dateFilter1,dateFilter2]);

  React.useEffect(() => {
    console.log({firstDate:rangeDate[0],lastDate:rangeDate[1]})
    hotel
      .getRoomSaleSumWithAgentData()
      .then(({ data }) => {
        if(data===undefined || data===null) return;
        for (var i = 0; i < data.length; i++) {
          data[i].processDate = new Date(data[i].processDate);
        }

        loadRangeData(data);
        setHotelData(data);
        loadData(data);

      })
  }, [])

  const loadRangeData = (data) =>{
    var rangeData = Object.values(data.map(({processDate,roomSum,pax, incomeSumEUR})=>({processDate,roomSum,pax, incomeSumEUR})).reduce((r, o) => (r[o.processDate]
      ? (r[o.processDate].roomSum += o.roomSum,r[o.processDate].pax += o.pax,r[o.processDate].incomeSumEUR += o.incomeSumEUR)
      : (r[o.processDate] = {...o}), r), {}))
    setHotelRangeData(rangeData);
  }

  const loadData = (data) =>{
    
    let sumRoom = 0;
    let sumPax = 0;
    let sumIncomeSumEUR = 0;
    data.forEach(({roomSum,pax, incomeSumEUR}) => {
      sumRoom +=roomSum;
      sumPax +=pax;
      sumIncomeSumEUR +=incomeSumEUR;
    });

    var agentData = Object.values(data.map(({agentName,roomSum,pax, incomeSumEUR})=>({agentName,roomSum,pax, incomeSumEUR})).reduce((r, o) => (r[o.agentName]
      ? (r[o.agentName].roomSum += o.roomSum,r[o.agentName].pax += o.pax,r[o.agentName].incomeSumEUR += o.incomeSumEUR)
      : (r[o.agentName] = {...o}), r), {}))
      .map(({agentName,roomSum,pax, incomeSumEUR})=>(
        {name:agentName,value:roomSum/sumRoom,roomSum,pax, incomeSumEUR:incomeSumEUR})
      );
    var countryData = Object.values(data.map(({countryName,roomSum,pax, incomeSumEUR})=>({countryName,roomSum,pax, incomeSumEUR})).reduce((r, o) => (r[o.countryName]
        ? (r[o.countryName].roomSum += o.roomSum,r[o.countryName].pax += o.pax,r[o.countryName].incomeSumEUR += o.incomeSumEUR)
        : (r[o.countryName] = {...o}), r), {}))
        .map(({countryName,roomSum,pax, incomeSumEUR})=>(
          {name:countryName,value:roomSum/sumRoom,roomSum,pax, incomeSumEUR:incomeSumEUR})
        );

    setHotelCountryData(countryData);
    setHotelAgentData(agentData);

    
  }

  const updateVisualRange = (range) =>{
    var newData = Object.assign(hotelData.filter(x=>x.processDate>=range.value[0] && x.processDate<range.value[1]));
    loadData(newData);
    setRangeDate(range.value);
  }

  return (
    <React.Fragment>
      <ScrollView  width='100%' height={window.innerHeight-(window.innerWidth>1080? 210:170)} >
     <div className={window.innerWidth>1080?"pies-container":null} style={{margin:10}}>
     {/* <div className="dx-field">
            <div className="dx-field-label">Default mode</div>
            <div className="dx-field-value">
              <SelectBox items={[10,9,8,7,6,5,4,3,2,1]} />
            </div>
          </div>
     <PieChart
      className="pie"
      key={"pie"}
      title={"ACENTA"}
      palette={"Soft"}
      sizeGroup="piesGroup"
      dataSource={hotelAgentData}>
        <Series argumentField="agentName" valueField="roomRate" maxLabelCount={10}>
        <SmallValuesGrouping mode="topN" topCount={7} groupName="Diğer"/>
        {window.innerWidth<1080?  <Label
            visible={true}
            position="columns"
            customizeText={(arg)=>{return `${arg.argumentText} (${arg.percentText})`}}
            >
            <Font size={8} />
            <Connector visible={false} width={1} />
          </Label>: <Label
            visible={true}
            position="columns"
            customizeText={(arg)=>{return `${arg.argumentText} (${arg.percentText})`}}
            >
            <Font size={11} />
            <Connector visible={true} width={1} />
          </Label>}
       
        </Series>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
          itemTextPosition="right"
          rowCount={2}/>
          <Tooltip
        enabled={true}
        contentRender={TooltipTemplate}
      />
    </PieChart>
   
    <PieChart
      className="pie"
      key={"pie"}
      title={"ÜLKE"}
      palette={"Soft-Pastel"}
      sizeGroup="piesGroup"
      dataSource={hotelCountryData}>
        <Series argumentField="countryName" valueField="roomRate" maxLabelCount={10}>
        <SmallValuesGrouping mode="topN" topCount={7} groupName="Diğer"/>
        <Label
            visible={true}
            position="columns"
            customizeText={(arg)=>{return `${arg.argumentText} (${arg.percentText})`}}>
            <Font size={11} />
            <Connector visible={true} width={1} />
          </Label>
        </Series>
        <Legend
          verticalAlignment="bottom"
          horizontalAlignment="center"
          itemTextPosition="right"
          rowCount={2}/>
          <Tooltip
        enabled={true}
        contentRender={TooltipTemplate}
      />
    </PieChart>
     */}
     <TreeChart data={hotelAgentData} topNrange={{minValue:3,maxValue:11,step:2, defaultValue:7}} title={"ACENTA (Tree-Chart)"} toolTipTemplate={TooltipTemplate}/>
     <TreeChart data={hotelCountryData} topNrange={{minValue:3,maxValue:11,step:2, defaultValue:7}} 
        title={"ÜLKE (Tree-Chart)"} toolTipTemplate={TooltipTemplate} colorOptionName={"soft-pastel"}/>
     </div>
     </ScrollView>
     <RangeSelectorChart data={hotelRangeData} value={rangeDate} updateRange={updateVisualRange} chartOption={{argumentField:'processDate',valueField:'roomSum',type:'area'}}/>
    </React.Fragment>
    )
}

const formatNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
}).format;

function TooltipTemplate({node}) {
  var data = node.data;
  return (
    <div className="state-tooltip">
      <h4 className="state" style={{ textDecoration: "underline"}}>{data.name}</h4>
      <div className="room" >
        <span className="caption">Oda</span>: {formatNumber(data.roomSum)}
      </div>
      <div className="pax">
        <span className="caption">Pax</span>: {formatNumber(data.pax)} kişi
      </div>
      <div>
        <span className="caption">Gelir (EUR)</span>: <span className="income-eur">{formatNumber(data.incomeSumEUR)}</span>
      </div>
      <div>
        <span className="caption">Gelir/Pax (EUR)</span>: <span className="income-eur">{formatNumber(data.incomeSumEUR/data.pax)}</span>
      </div>
      <div>
        <span className="caption">Gelir/Oda (EUR)</span>: <span className="income-eur">{formatNumber(data.incomeSumEUR/data.roomSum)}</span>
      </div>
    </div>
  );
}

