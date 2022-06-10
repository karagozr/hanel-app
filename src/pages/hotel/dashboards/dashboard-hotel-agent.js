import React from "react";
import { useHotelData } from '../../../contexts/hooks'
import ScrollView from 'devextreme-react/scroll-view';
import './dashboard-hotel.css'
import { TreeChart, RangeSelectorChart, HotelAgencyMarketDashLayout } from '../../../components';

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
        (r, o) => (r[o.processDate] ? (
          r[o.processDate].roomSum      += o.roomSum, 
          r[o.processDate].pax          += o.pax, 
          r[o.processDate].incomeSumEUR += o.incomeSumEUR)
          : (r[o.processDate] = { ...o }), r), {}))
    setHotelRangeData(rangeData);

    const sums = [
      ...data.reduce(
        (map, item) => {
          const { processDate: key, qty } = item;
          const prev = map.get(key);

          if (prev) {
            prev.qty += qty
          } else {
            map.set(key, Object.assign({}, item))
          }

          return map
        },
        new Map()
      ).values()
    ]


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

    var agentData = Object.values(data.map(({ agencyName, roomSum, pax, incomeSumEUR }) => ({ agencyName, roomSum, pax, incomeSumEUR })).reduce((r, o) => (r[o.agencyName]
      ? (r[o.agencyName].roomSum += o.roomSum, r[o.agencyName].pax += o.pax, r[o.agencyName].incomeSumEUR += o.incomeSumEUR)
      : (r[o.agencyName] = { ...o }), r), {}))
      .map(({ agencyName, roomSum, pax, incomeSumEUR }) => (
        { name: agencyName, value: roomSum / sumRoom, roomSum, pax, incomeSumEUR: incomeSumEUR })
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


  const getFilteredTotalRoom = (data) => data.reduce((accumulator, a) => {
    return accumulator + a.roomSum;
  }, 0);

  const othersSummaryForAgent = (data) => {
    console.log("hotelAgentData : ", getFilteredTotalRoom(hotelAgentData))

    var sumRoom = getFilteredTotalRoom(hotelAgentData);
    let totalRoom = 0;
    let totalPax = 0;
    let totalIncome = 0;
    data.forEach(({ name, value, roomSum, pax, incomeSumEUR }) => {
      totalRoom += roomSum;
      totalPax += pax;
      totalIncome += incomeSumEUR;
    })
    return sumRoom > 0 && { name: 'Diğerleri', value: totalRoom / sumRoom, roomSum: totalRoom, pax: totalPax, incomeSumEUR: totalIncome }
  }

  const othersSummaryForCountry = (data) => {
    console.log("hotelCountryData : ", getFilteredTotalRoom(hotelCountryData))

    var sumRoom = getFilteredTotalRoom(hotelCountryData);
    let totalRoom = 0;
    let totalPax = 0;
    let totalIncome = 0;
    data.forEach(({ name, value, roomSum, pax, incomeSumEUR }) => {
      totalRoom += roomSum;
      totalPax += pax;
      totalIncome += incomeSumEUR;
    })
    return sumRoom > 0 && { name: 'DİĞER', value: totalRoom / sumRoom, roomSum: totalRoom, pax: totalPax, incomeSumEUR: totalIncome }
  }

  return (
    <div>
      <ScrollView width='100%' height={window.innerHeight - (window.innerWidth > 1080 ? 210 : 180)} >
        <HotelAgencyMarketDashLayout>
        <TreeChart key="tree-1" data={hotelAgentData} topNrange={{ minValue: 3, maxValue: 11, step: 2, defaultValue: 7 }}
            title={"ACENTA (Tree-Chart)"} toolTipTemplate={TooltipTemplate} calculateOthers={othersSummaryForAgent} />
          <TreeChart key="tree-2" data={hotelCountryData} topNrange={{ minValue: 3, maxValue: 11, step: 2, defaultValue: 7 }}
            title={"ÜLKE (Tree-Chart)"} toolTipTemplate={TooltipTemplate} colorOptionName={"soft-pastel"} calculateOthers={othersSummaryForCountry} />
        </HotelAgencyMarketDashLayout>
          
        
      </ScrollView>
      <RangeSelectorChart data={hotelRangeData} updateRange={updateVisualRange} chartOption={{ argumentField: 'processDate', valueField: 'roomSum', type: 'area' }} />
    </div>
  )
}

const formatNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
}).format;

const formatNumber1Digit = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1
}).format;



function TooltipTemplate({ node }) {
  var data = node.data;
  return (
    <div className="dash-tooltip">
      <div className="state-tooltip" style={{ marginBottom: '2px' }}>
        <h4 className="state">{data.name}</h4>
        <hr className="dash-tooltip-line" />
        <table className={"dash-tooltip-table"}>
          <tbody style={{ border: '1px solid white;' }}>
            <tr>
              <td style={{ width: '50%' }}>Oran</td>
              <td style={{ width: '5%' }}>:</td>
              <td >{formatNumber1Digit(data.value * 100)} %</td>
            </tr>
            <tr>
              <td >Oda</td>
              <td style={{ width: '5%' }}>:</td>
              <td >{formatNumber(data.roomSum)}</td>
            </tr>
            <tr>
              <td >Pax</td>
              <td style={{ width: '5%' }}>:</td>
              <td >{formatNumber(data.pax)} kişi</td>
            </tr>
            <tr>
              <td >Gelir (EUR)</td>
              <td style={{ width: '5%' }}>:</td>
              <td ><span className="income-eur">{formatNumber(data.incomeSumEUR)}</span></td>
            </tr>
            <tr>
              <td >Gelir/Pax (EUR)</td>
              <td style={{ width: '5%' }}>:</td>
              <td ><span className="income-eur">{formatNumber(data.incomeSumEUR / data.pax)}</span></td>
            </tr>
            <tr>
              <td >Gelir/Oda (EUR)</td>
              <td style={{ width: '5%' }}>:</td>
              <td ><span className="income-eur">{formatNumber(data.incomeSumEUR / data.roomSum)}</span></td>
            </tr>
          </tbody>
        </table>


      </div>
    </div>

  );
}
