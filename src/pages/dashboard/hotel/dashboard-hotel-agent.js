import React from "react";
import { useHotelData } from '../../../contexts/hooks'
import ScrollView from 'devextreme-react/scroll-view';
import './dashboard-hote-agent.css'
import { TreeChart, RangeSelectorChart } from '../../../components';

var now = new Date();
const dateFilter1 = new Date(now.getFullYear(), now.getMonth(), 1);
const dateFilter2 = now.getMonth() === 11 ? new Date(now.getFullYear() + 1, 0, 1) : new Date(now.getFullYear(), now.getMonth() + 1, 1);


export const HotelDashboardAgent = () => {
  const hotel = useHotelData();
  const [hotelData, setHotelData] = React.useState([]);
  const [hotelRangeData, setHotelRangeData] = React.useState([]);
  const [hotelAgentData, setHotelAgentData] = React.useState([]);
  const [hotelCountryData, setHotelCountryData] = React.useState([]);
  const [rangeDate, setRangeDate] = React.useState([dateFilter1, dateFilter2]);

  React.useEffect(() => {
    //console.log({ firstDate: rangeDate[0], lastDate: rangeDate[1] })
    hotel
      .getRoomSaleSumWithAgentData()
      .then(({ data }) => {
        if (data === undefined || data === null) return;
        for (var i = 0; i < data.length; i++) {
          data[i].processDate = new Date(data[i].processDate);
        }

        loadRangeData(data);
        setHotelData(data);
        loadData(data);

      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadRangeData = (data) => {
    var rangeData = Object.values(data.map(({ processDate, roomSum, pax, incomeSumEUR }) => 
    ({ processDate, roomSum, pax, incomeSumEUR })).reduce(
        (r, o) => (r[o.processDate] ? (r[o.processDate].roomSum += o.roomSum, r[o.processDate].pax += o.pax, r[o.processDate].incomeSumEUR += o.incomeSumEUR)
        : (r[o.processDate] = { ...o }), r), {}) )
    setHotelRangeData(rangeData);

    const sums = [
      ...data.reduce(
        (map, item) => {
          const { processDate: key, qty } = item;
          const prev = map.get(key);
          
          if(prev) {
            prev.qty += qty
          } else {
            map.set(key, Object.assign({}, item))
          }
          
          return map
        },
        new Map()
      ).values()
    ]

    console.log('MAPPPPP : ',sums)
  }

  const loadData = (data) => {

    let sumRoom = 0;
    // let sumPax = 0;
    // let sumIncomeSumEUR = 0;
    data.forEach(({ roomSum, pax, incomeSumEUR }) => {
      sumRoom += roomSum;
      // sumPax += pax;
      // sumIncomeSumEUR += incomeSumEUR;
    });

    var agentData = Object.values(data.map(({ agentName, roomSum, pax, incomeSumEUR }) => ({ agentName, roomSum, pax, incomeSumEUR })).reduce((r, o) => (r[o.agentName]
      ? (r[o.agentName].roomSum += o.roomSum, r[o.agentName].pax += o.pax, r[o.agentName].incomeSumEUR += o.incomeSumEUR)
      : (r[o.agentName] = { ...o }), r), {}))
      .map(({ agentName, roomSum, pax, incomeSumEUR }) => (
        { name: agentName, value: roomSum / sumRoom, roomSum, pax, incomeSumEUR: incomeSumEUR })
      );
    var countryData = Object.values(data.map(({ countryName, roomSum, pax, incomeSumEUR }) => ({ countryName, roomSum, pax, incomeSumEUR })).reduce((r, o) => (r[o.countryName]
      ? (r[o.countryName].roomSum += o.roomSum, r[o.countryName].pax += o.pax, r[o.countryName].incomeSumEUR += o.incomeSumEUR)
      : (r[o.countryName] = { ...o }), r), {}))
      .map(({ countryName, roomSum, pax, incomeSumEUR }) => (
        { name: countryName, value: roomSum / sumRoom, roomSum, pax, incomeSumEUR: incomeSumEUR })
      );

    setHotelCountryData(countryData);
    setHotelAgentData(agentData);

  }

  const updateVisualRange = (range) => {
    
    var newData = Object.assign(hotelData.filter(x => x.processDate >= range.value[0] && x.processDate < range.value[1]));
    loadData(newData);
    setRangeDate(range.value);
  }

  return (
    <div>
      <ScrollView width='100%' height={window.innerHeight - (window.innerWidth > 1080 ? 210 : 180)} >
        <div className={window.innerWidth > 1080 ? "pies-container" : null} style={{ margin: 10 }}>
          <TreeChart key="tree-1" data={hotelAgentData} topNrange={{ minValue: 3, maxValue: 11, step: 2, defaultValue: 7 }} 
           title={"ACENTA (Tree-Chart)"} toolTipTemplate={TooltipTemplate} />
          <TreeChart key="tree-2" data={hotelCountryData} topNrange={{ minValue: 3, maxValue: 11, step: 2, defaultValue: 7 }}
            title={"ÜLKE (Tree-Chart)"} toolTipTemplate={TooltipTemplate} colorOptionName={"soft-pastel"} />
        </div>
      </ScrollView>
      <RangeSelectorChart data={hotelRangeData} updateRange={updateVisualRange} chartOption={{ argumentField: 'processDate', valueField: 'roomSum', type: 'area' }} />
    </div>
  )
}

const formatNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
}).format;

function TooltipTemplate({ node }) {
  var data = node.data;
  return (
    <div className="state-tooltip">
      <h4 className="state" style={{ textDecoration: "underline" }}>{data.name}</h4>
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
        <span className="caption">Gelir/Pax (EUR)</span>: <span className="income-eur">{formatNumber(data.incomeSumEUR / data.pax)}</span>
      </div>
      <div>
        <span className="caption">Gelir/Oda (EUR)</span>: <span className="income-eur">{formatNumber(data.incomeSumEUR / data.roomSum)}</span>
      </div>
    </div>
  );
}

