import React from "react";
import { useHotelData } from '../../../contexts/hooks'
import lodashJoin from 'lodash-joins'
import { HotelHomeDashLayout, InfoGrid, RangeSelectorChart } from '../../../components';
import ScrollView from 'devextreme-react/scroll-view';
import DataGrid, { Column, Scrolling, Paging, Summary, TotalItem, SearchPanel } from 'devextreme-react/data-grid';
import './dashboard-hotel.css'
import { Button, TabPanel } from "devextreme-react";
import { getCurrentYear, getYearFirstDate, getYearLastDate, years } from "../../../helper";
import moment from "moment";

var now = new Date();
const dateFilter1 = new Date(now.getFullYear(), 0, 1);
const dateFilter2 = new Date(now.getFullYear() + 1, 0, 1);

export const HotelDashboardHome = () => {
  const hotel = useHotelData();

  const [hotelData, setHotelData] = React.useState([]);
  const [hotelCapacity, setHotelCapacity] = React.useState(0);
  const [hotelRangeData, setHotelRangeData] = React.useState([]);
  const [hotelReportData, setHotelReportData] = React.useState({ agencyData: [], countryData: [], marketData: [] });

  const [queryFilter, setQueryFilter] = React.useState({ year1: getCurrentYear(), year2: getCurrentYear() - 1 })

  const [filter, setFilter] = React.useState({ range: [dateFilter1, dateFilter2], caption: null, value: null });

  const fetchData = async () => {

    var _lastYearFirst = getYearFirstDate(getCurrentYear() - 1)
    var _lastYearLast = getYearLastDate(getCurrentYear() - 1)

    var reqArr = [];

    reqArr.push(hotel.getHotelCapacity("SundiaFethiyeHotelCapacity"));
    reqArr.push(hotel.getRoomSaleSumWithACMData());
    reqArr.push(hotel.getRoomSaleSumWithACMData({ firstDate: _lastYearFirst, lastDate: _lastYearLast }));
   
    var res = await Promise.all(reqArr);
 
    setHotelCapacity(res[0].data !== null && res[0].data.capacity);
  

    if (res[1].data === undefined || res[2].data === null) return;


    res[1].data.forEach(e => e.processDate = new Date(e.processDate))
    res[2].data.forEach(e => e.processDate = new Date(e.processDate))
    
    loadRangeData(res[1].data);
    setHotelData({ currYearData: res[1].data, lastYearData: res[2].data });
    loadData({ currYearData: res[1].data, lastYearData: res[2].data }, res[0].data.capacity, (dateFilter2 - dateFilter1) / (1000 * 60 * 60 * 24));
  }

  React.useEffect(() => {
    fetchData();
  }, [])

  const loadRangeData = (data) => {
    var rangeData = Object.values(data.map(({ processDate, roomSum, pax, incomeSumEUR }) =>
      ({ processDate, roomSum, pax, incomeSumEUR })).reduce(
        (r, o) => (r[o.processDate] ? (r[o.processDate].roomSum += o.roomSum, r[o.processDate].pax += o.pax, r[o.processDate].incomeSumEUR += o.incomeSumEUR)
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

  const loadData = (data, capacity, rangeDays) => {

    let sumRoom = 0;
    let sumPax = 0;
    let sumIncomeSumEUR = 0;
    let occupancy = 0;
    data.currYearData.forEach(({ roomSum, pax, incomeSumEUR }) => {
      sumRoom += roomSum;
      sumPax += pax;
      sumIncomeSumEUR += incomeSumEUR;
    });

    occupancy = sumRoom / (capacity * rangeDays);

    let sumRoom2 = 0;
    let sumPax2 = 0;
    let sumIncomeSumEUR2 = 0;
    let occupancy2 = 0;
    data.lastYearData.forEach(({ roomSum, pax, incomeSumEUR }) => {
      sumRoom2 += roomSum;
      sumPax2 += pax;
      sumIncomeSumEUR2 += incomeSumEUR;
    });

    occupancy2 = sumRoom2 / (capacity * rangeDays);



    const agencyData1 = [...data.currYearData.reduce(
      (r, o) => {

        const key = o.agencyName;

        const item = r.get(key) || Object.assign({ description: key }, {
          pax: 0,
          roomSum: 0,
          occupancy: 0,
          pp: 0,
          incomeSumEUR: 0
        });

        item.pax += o.pax;
        item.roomSum += o.roomSum;
        item.occupancy = (item.roomSum / sumRoom) * 100;
        item.incomeSumEUR += o.incomeSumEUR;
        item.pp = item.incomeSumEUR / item.pax;

        return r.set(key, item);
      }, new Map).values()].sort((a, b) => { return b.occupancy - a.occupancy });

    const agencyData2 = [...data.lastYearData.reduce(
      (r, o) => {

        const key = o.agencyName;

        const item = r.get(key) || Object.assign({ description: key }, {
          pax: 0,
          roomSum: 0,
          occupancy: 0,
          pp: 0,
          incomeSumEUR: 0
        });

        item.pax += o.pax;
        item.roomSum += o.roomSum;
        item.occupancy = (item.roomSum / sumRoom) * 100;
        item.incomeSumEUR += o.incomeSumEUR;
        item.pp = item.incomeSumEUR / item.pax;

        return r.set(key, item);
      }, new Map).values()].sort((a, b) => { return b.occupancy - a.occupancy }).map(x => ({
        description: x.description,
        pax2: x.pax,
        roomSum2: x.roomSum,
        occupancy2: x.occupancy,
        pp2: x.pp,
        incomeSumEUR2: x.incomeSumEUR
      }));




    let agencyData = lodashJoin.hashFullOuterJoin(agencyData1, (obj) => obj["description"], agencyData2, (obj) => obj["description"])
      .map(e => ({
        description: e.description,
        pax2: e.pax2 != undefined ? e.pax2 : 0,
        roomSum2: e.roomSum2 != undefined ? e.roomSum2 : 0,
        occupancy2: e.occupancy2 != undefined ? e.occupancy2 : 0,
        pp2: e.pp2 != undefined ? e.pp2 : 0,
        incomeSumEUR2: e.incomeSumEUR2 != undefined ? e.incomeSumEUR2 : 0,

        pax: e.pax != undefined ? e.pax : 0,
        roomSum: e.roomSum != undefined ? e.roomSum : 0,
        occupancy: e.occupancy != undefined ? e.occupancy : 0,
        pp: e.pp != undefined ? e.pp : 0,
        incomeSumEUR: e.incomeSumEUR != undefined ? e.incomeSumEUR : 0,

      })).map((e) => ({
        ...e,
        paxRate: parseInt(e.pax2 !== 0 ? ((e.pax / e.pax2 - 1) * 100).toFixed(0) : 100),
        roomSumRate: parseInt(e.roomSum2 !== 0 ? ((e.roomSum / e.roomSum2 - 1) * 100).toFixed(0) : 100),
        occupancyRate: parseInt(e.occupancy2 !== 0 ? ((e.occupancy / e.occupancy2 - 1) * 100).toFixed(0) : 100),
        ppRate: parseInt(e.pp2 !== 0 ? ((e.pp / e.pp2 - 1) * 100).toFixed(0) : 100),
        incomeSumEURRate: parseInt(e.incomeSumEUR2 !== 0 ? ((e.incomeSumEUR / e.incomeSumEUR2 - 1) * 100).toFixed(0) : 100),
      }))


    const countryData1 = [...data.currYearData.reduce(
      (r, o) => {

        const key = o.countryName;

        const item = r.get(key) || Object.assign({ description: key }, {
          pax: 0,
          roomSum: 0,
          occupancy: 0,
          pp: 0,
          incomeSumEUR: 0
        });

        item.pax += o.pax;
        item.roomSum += o.roomSum;
        item.occupancy = (item.roomSum / sumRoom) * 100;
        item.incomeSumEUR += o.incomeSumEUR;
        item.pp = item.incomeSumEUR / item.pax;

        return r.set(key, item);
      }, new Map).values()].sort((a, b) => { return b.occupancy - a.occupancy });

    const countryData2 = [...data.lastYearData.reduce(
      (r, o) => {

        const key = o.countryName;

        const item = r.get(key) || Object.assign({ description: key }, {
          pax: 0,
          roomSum: 0,
          occupancy: 0,
          pp: 0,
          incomeSumEUR: 0
        });

        item.pax += o.pax;
        item.roomSum += o.roomSum;
        item.occupancy = (item.roomSum / sumRoom) * 100;
        item.incomeSumEUR += o.incomeSumEUR;
        item.pp = item.incomeSumEUR / item.pax;

        return r.set(key, item);
      }, new Map).values()].sort((a, b) => { return b.occupancy - a.occupancy }).map(x => ({
        description: x.description,
        pax2: x.pax,
        roomSum2: x.roomSum,
        occupancy2: x.occupancy,
        pp2: x.pp,
        incomeSumEUR2: x.incomeSumEUR
      }));

    let countryData = lodashJoin.hashFullOuterJoin(countryData1, (obj) => obj["description"], countryData2, (obj) => obj["description"])
      .map(e => ({
        description: e.description,
        pax2: e.pax2 != undefined ? e.pax2 : 0,
        roomSum2: e.roomSum2 != undefined ? e.roomSum2 : 0,
        occupancy2: e.occupancy2 != undefined ? e.occupancy2 : 0,
        pp2: e.pp2 != undefined ? e.pp2 : 0,
        incomeSumEUR2: e.incomeSumEUR2 != undefined ? e.incomeSumEUR2 : 0,

        pax: e.pax != undefined ? e.pax : 0,
        roomSum: e.roomSum != undefined ? e.roomSum : 0,
        occupancy: e.occupancy != undefined ? e.occupancy : 0,
        pp: e.pp != undefined ? e.pp : 0,
        incomeSumEUR: e.incomeSumEUR != undefined ? e.incomeSumEUR : 0,

      })).map((e) => ({
        ...e,
        paxRate: parseInt(e.pax2 !== 0 ? ((e.pax / e.pax2 - 1) * 100).toFixed(0) : 100),
        roomSumRate: parseInt(e.roomSum2 !== 0 ? ((e.roomSum / e.roomSum2 - 1) * 100).toFixed(0) : 100),
        occupancyRate: parseInt(e.occupancy2 !== 0 ? ((e.occupancy / e.occupancy2 - 1) * 100).toFixed(0) : 100),
        ppRate: parseInt(e.pp2 !== 0 ? ((e.pp / e.pp2 - 1) * 100).toFixed(0) : 100),
        incomeSumEURRate: parseInt(e.incomeSumEUR2 !== 0 ? ((e.incomeSumEUR / e.incomeSumEUR2 - 1) * 100).toFixed(0) : 100),
      }))

    const marketData1 = [...data.currYearData.reduce(
      (r, o) => {

        const key = o.marketName;

        const item = r.get(key) || Object.assign({ description: key }, {
          pax: 0,
          roomSum: 0,
          occupancy: 0,
          pp: 0,
          incomeSumEUR: 0
        });

        item.pax += o.pax;
        item.roomSum += o.roomSum;
        item.occupancy = (item.roomSum / sumRoom) * 100;
        item.incomeSumEUR += o.incomeSumEUR;
        item.pp = item.incomeSumEUR / item.pax;

        return r.set(key, item);
      }, new Map).values()].sort((a, b) => { return b.occupancy - a.occupancy });

    const marketData2 = [...data.lastYearData.reduce(
      (r, o) => {

        const key = o.marketName;

        const item = r.get(key) || Object.assign({ description: key }, {
          pax: 0,
          roomSum: 0,
          occupancy: 0,
          pp: 0,
          incomeSumEUR: 0
        });

        item.pax += o.pax;
        item.roomSum += o.roomSum;
        item.occupancy = (item.roomSum / sumRoom) * 100;
        item.incomeSumEUR += o.incomeSumEUR;
        item.pp = item.incomeSumEUR / item.pax;

        return r.set(key, item);
      }, new Map).values()].sort((a, b) => { return b.occupancy - a.occupancy }).map(x => ({
        description: x.description,
        pax2: x.pax,
        roomSum2: x.roomSum,
        occupancy2: x.occupancy,
        pp2: x.pp,
        incomeSumEUR2: x.incomeSumEUR
      }));

    let marketData = lodashJoin.hashFullOuterJoin(marketData1, (obj) => obj["description"], marketData2, (obj) => obj["description"])
      .map(e => ({
        description: e.description,
        pax2: e.pax2 != undefined ? e.pax2 : 0,
        roomSum2: e.roomSum2 != undefined ? e.roomSum2 : 0,
        occupancy2: e.occupancy2 != undefined ? e.occupancy2 : 0,
        pp2: e.pp2 != undefined ? e.pp2 : 0,
        incomeSumEUR2: e.incomeSumEUR2 != undefined ? e.incomeSumEUR2 : 0,

        pax: e.pax != undefined ? e.pax : 0,
        roomSum: e.roomSum != undefined ? e.roomSum : 0,
        occupancy: e.occupancy != undefined ? e.occupancy : 0,
        pp: e.pp != undefined ? e.pp : 0,
        incomeSumEUR: e.incomeSumEUR != undefined ? e.incomeSumEUR : 0,

      })).map((e) => ({
        ...e,
        paxRate: parseInt(e.pax2 !== 0 ? ((e.pax / e.pax2 - 1) * 100).toFixed(0) : 100),
        roomSumRate: parseInt(e.roomSum2 !== 0 ? ((e.roomSum / e.roomSum2 - 1) * 100).toFixed(0) : 100),
        occupancyRate: parseInt(e.occupancy2 !== 0 ? ((e.occupancy / e.occupancy2 - 1) * 100).toFixed(0) : 100),
        ppRate: parseInt(e.pp2 !== 0 ? ((e.pp / e.pp2 - 1) * 100).toFixed(0) : 100),
        incomeSumEURRate: parseInt(e.incomeSumEUR2 !== 0 ? ((e.incomeSumEUR / e.incomeSumEUR2 - 1) * 100).toFixed(0) : 100),
      }))


    // const countryData = [...data.reduce((r, o) => {
    //   const key = o.countryName;

    //   const item = r.get(key) || Object.assign({ description: key }, {
    //     pax: 0,
    //     roomSum: 0,
    //     occupancy: 0,
    //     pp:0,
    //     incomeSumEUR: 0
    //   });

    //   item.pax += o.pax;
    //   item.roomSum += o.roomSum;
    //   item.occupancy = (item.roomSum / sumRoom)*100;
    //   item.incomeSumEUR += o.incomeSumEUR;
    //   item.pp = item.incomeSumEUR/item.pax;

    //   return r.set(key, item);
    // }, new Map).values()].sort((a, b) => { return b.occupancy - a.occupancy });

    // const marketData = [...data.reduce((r, o) => {
    //   const key = o.marketName;

    //   const item = r.get(key) || Object.assign({ description: key }, {
    //     pax: 0,
    //     roomSum: 0,
    //     occupancy: 0,
    //     pp:0,
    //     incomeSumEUR: 0
    //   });

    //   item.pax += o.pax;
    //   item.roomSum += o.roomSum;
    //   item.occupancy = (item.roomSum / sumRoom)*100;
    //   item.incomeSumEUR += o.incomeSumEUR;
    //   item.pp = item.incomeSumEUR/item.pax;

    //   return r.set(key, item);
    // }, new Map).values()].sort((a, b) => { return b.occupancy - a.occupancy });


    setHotelReportData({
      agencyData: agencyData,
      countryData: countryData,
      marketData: marketData,

      totalRoom: sumRoom,
      totalPax: sumPax,
      occupancy: occupancy,
      totalIncome: sumIncomeSumEUR,
      paxPIncome: sumIncomeSumEUR / sumPax,
      roomPIncome: sumIncomeSumEUR / sumRoom,

      totalRoom2: sumRoom2,
      totalPax2: sumPax2,
      occupancy2: occupancy2,
      totalIncome2: sumIncomeSumEUR2,
      paxPIncome2: sumIncomeSumEUR2 / sumPax2,
      roomPIncome2: sumIncomeSumEUR2 / sumRoom2,
    })


  }

  const updateVisualRange = (range) => {

    if (!hotelData.currYearData) return;
    
    loadData({
        currYearData : hotelData.currYearData.filter(x =>x[filter.dataField] === filter.value || (x.processDate >= filter.range[0] && x.processDate < filter.range[1])),
        lastYearData : hotelData.lastYearData.filter(x =>x[filter.dataField] === filter.value || (x.processDate >= moment(filter.range[0]).add("y",-1) && x.processDate < moment(filter.range[1]).add("y",-1)))
        }, hotelCapacity,
        ((filter.range[1] - filter.range[0])) / (1000 * 60 * 60 * 24));

    setFilter({ ...filter, range: range.value });
  }

  const onRowClick = (e) => {
    loadData({
      currYearData : hotelData.currYearData.filter(x => x[e.dataField] === e.data.description && x.processDate >= filter.range[0] && x.processDate < filter.range[1]),
      lastYearData : hotelData.lastYearData.filter(x => x[e.dataField] === e.data.description && x.processDate >= moment(filter.range[0]).add("y",-1) && x.processDate < moment(filter.range[1]).add("y",-1))
      }, hotelCapacity,
      ((filter.range[1] - filter.range[0])) / (1000 * 60 * 60 * 24));


    setFilter({ ...filter, dataField: e.dataField, caption: e.caption, value: e.data.description });

  };

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const onFilterClear = (e) => {
    loadData({
      currYearData : hotelData.currYearData.filter(x => x.processDate >= filter.range[0] && x.processDate < filter.range[1]),
      lastYearData : hotelData.lastYearData.filter(x => x.processDate >= moment(filter.range[0]).add("y",-1) && x.processDate < moment(filter.range[1]).add("y",-1))
      }, hotelCapacity,
      ((filter.range[1] - filter.range[0])) / (1000 * 60 * 60 * 24));

    setFilter({ ...filter, caption: null, value: null })
  }
  return (
    <div id="page" style={{ margin: "5px" }}>
      <ScrollView width='100%' height={window.innerHeight - (window.innerWidth > 700 ? 210 : 180)} >
        <HotelHomeDashLayout>
          <Header filter={filter} onFilterClear={onFilterClear} />
          <InfoBox title="Oda" data={{value1 : formatNumber0digit(hotelReportData.totalRoom),value2 : formatNumber0digit(hotelReportData.totalRoom2)}} />
          <InfoBox title="Pax" data={{value1 : formatNumber0digit(hotelReportData.totalPax),value2 : formatNumber0digit(hotelReportData.totalPax2)}} />
          <InfoBox title="Ciro (EUR)" data={{value1 : formatNumber0digit(hotelReportData.totalIncome),value2 : formatNumber0digit(hotelReportData.totalIncome2)}} />
          <InfoBox title="P.P.(EUR)" data={{value1 : formatNumber0digit(hotelReportData.paxPIncome),value2 : formatNumber0digit(hotelReportData.paxPIncome2)}} />
          <InfoBox title="A.R.R.(EUR)" data={{value1 : formatNumber0digit(hotelReportData.roomPIncome),value2 : formatNumber0digit(hotelReportData.roomPIncome2)}} />
          <InfoBox title="DOLULUK" data={{value1 : "% " + formatNumber1digit(hotelReportData.occupancy * 100),value2 : "% " + formatNumber1digit(hotelReportData.occupancy2 * 100)}} />
          <TabPanel
            onSelectedIndexChange={e => setSelectedIndex(e)}
            itemTitleRender={tabTitleRender}
            selectedIndex={selectedIndex}
            dataSource={[
              {
                title: "Ülkeler Bazında Satış Verileri",
                caption: "ÜLKE",
                dataField: "countryName",
                data: hotelReportData.countryData
              }, {
                title: "Acentalar Satış Verileri",
                caption: "ACENTA",
                dataField: "agencyName",
                data: hotelReportData.agencyData
              }, {
                title: "Pazarlar Bazında Satış Verileri",
                caption: "MARKET",
                dataField: "marketName",
                data: hotelReportData.marketData
              },

            ]}

            loop={true}
            // itemTitleRender={this.itemTitleRender}
            itemComponent={e => <InfoGrid onRowClick={onRowClick} data={e.data.data} {...e.data} years={{ year1: queryFilter.year1, year2: queryFilter.year2 }} />}
            animationEnabled={true}
            swipeEnabled={true}
          />
          {/* <InfoGrid onRowClick={onCountryRowClick} data={hotelReportData.countryData} title="Ülkeler Bazında Satış Verileri" />
          <InfoGrid onRowClick={onAgencyRowClick}data={hotelReportData.agencyData} title="Acentalar Satış Verileri" />
          <InfoGrid onRowClick={onMarketRowClick}data={hotelReportData.marketData} title="Pazarlar Bazında Satış Verileri" /> */}
        </HotelHomeDashLayout>
      </ScrollView>
      <RangeSelectorChart data={hotelRangeData} updateRange={updateVisualRange}
        chartOption={{ argumentField: 'processDate', valueField: 'roomSum', type: 'area' }} />
    </div>
  )
}

const formatNumber2digit = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2
}).format;

const formatNumber1digit = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1
}).format;


const formatNumber0digit = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
}).format;

const tabTitleRender = (e) =>(<span style={{fontWeight: 400, fontSize: "14px",color:"#FFF"}}>{e.title}</span>)

const InfoBox = ({ title, data }) => {

  return (
    <div className={'dx-card'} style={{ paddingBottom: '5px', marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
      <h5 style={{ marginBottom: "7px", marginTop: "10px" }}>{title}</h5>
      <hr style={{ backgroundColor: "#ff5722", borderColor: "#ff5722" }} />
      <h4 style={{ marginBottom: "4px", marginTop: "6px", fontWeight: 400, fontSize: "24px", color: "#8ee8fd" }}>{data.value1 === "NaN" ? "0" : data.value1}</h4>
      <h6 style={{ marginBottom: "5px", marginTop: "1px", fontWeight: 300, fontSize: "14px", color: "#9af998" }}>{data.value1 === "NaN" ? "0" : data.value2}</h6>
    </div>
  )
}

const Header = ({ filter, onFilterClear }) => {

  return (
    <React.Fragment>
      <div className={'dx-card'} style={{ textAlign: "center", paddingTop: 5, paddingBottom: 5, fontSize: 20 }}>
        <div style={{ display: "inline-block" }}>OTEL ÖZET</div> -  <div style={{ display: "inline-block" }}>
          {(filter.caption && filter.value) && <div style={{ display: "inline-block", fontSize: "0.7em", fontWeight: "200" }}>
            <div style={{ display: "inline-block" }}>{filter.caption} : <span>{filter.value}</span></div>
            <Button stylingMode="text" type="default" icon="close" onClick={onFilterClear} style={{ display: "inline-block" }}></Button>
          </div>}
        </div>
      </div>

    </React.Fragment>

  )
}
