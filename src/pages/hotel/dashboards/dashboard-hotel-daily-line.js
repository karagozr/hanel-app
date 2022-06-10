import React from "react";
import { useHotelData } from '../../../contexts/hooks'
import {
  Chart,
  Series,
  ArgumentAxis,
  ValueAxis,
  CommonSeriesSettings,
  Export,
  Legend,
  Format,
  Margin,
  Pane,
  Label,
  Title,
  Subtitle,
  Tooltip,
  Grid,
  ZoomAndPan,
  ScrollBar
} from 'devextreme-react/chart';
import TabPanel from 'devextreme-react/tab-panel';
import './dashboard-hotel.css'
import { getCurrentYear } from "../../../helper";
import moment from "moment";
import { FilterArea } from "../../../components";
import { SelectBox, TagBox, Toolbar } from "devextreme-react";
import { Item } from "devextreme-react/toolbar";

var now = new Date();
const dateFilter1 = new Date(getCurrentYear(), now.getMonth(), 1);
const dateFilter2 = now.getMonth() === 11 ? new Date(getCurrentYear() + 1, 0, 1) : new Date(now.getFullYear(), now.getMonth() + 1, 1);

const initialFilterData={ years:[getCurrentYear()], chartType:"line"};

export const HotelDashboardDailyLine = () => {
  const hotel = useHotelData();
  const [hotelData, setHotelData] = React.useState([]);
  const [filter, setFilter] = React.useState( initialFilterData);

  React.useEffect(() => {
    // hotel.getRoomIncomeSumData()
    //     .then(({data}) => {
    //         for(var i=0;i<data.length;i++){
    //           data[i].processDate=new Date(data[i].processDate);
    //           data[i].occupancy = data[i].occupancy*100;
    //         }
    //         setHotelData(data);
    //     });

    fetchData();

  }, [filter.years])


  const applyFilter = (e) => {
    setFilter({...filter,...e});
  }

  const fetchData = async () => {

    var reqArr = [];

    filter.years.forEach(e=>{
      reqArr.push(hotel.getRoomIncomeSumData(e))
    })
    // var res1 = hotel.getRoomIncomeSumData(getCurrentYear());

    // var res2 = hotel.getRoomIncomeSumData(getCurrentYear() - 1);

    var res = await Promise.all(reqArr);

    var arr = [];
    for (var j = 0; j < res.length; j++) {
      var data = res[j].data;

      for (var i = 0; i < data.length; i++) {

        arr.push(
          {
            processYear: moment(data[i].processDate).year(),
            processDate: moment(data[i].processDate).format("DD-MMMM"),
            [moment(data[i].processDate).year() + 'pax']: data[i].pax,
            [moment(data[i].processDate).year() + 'roomSum']: data[i].roomSum,
            [moment(data[i].processDate).year() + 'incomeSumEUR']: data[i].incomeSumEUR,
            [moment(data[i].processDate).year() + 'occupancy']: data[i].occupancy * 100
          })

      }
    }

    setHotelData([
      { title: "Pax", field: "pax", data: arr },
      { title: "Oda Satış", field: "roomSum", data: arr },
      { title: "Oran", field: "occupancy", data: arr },
      { title: "Gelir", field: "incomeSumEUR", data: arr }
    ])


  }


  const [selectedIndex, setSelectedIndex] = React.useState();

  return (
    <React.Fragment>
      <h3 className={'content-block'}>Otel Günlük Akış (Konaklama Bazlı)</h3>
      <div className={'content-block dx-card responsive-paddings'}>

        <FilterArea fields={[
          { fieldName: "years", label: "Yıllar", editorType: "dxTagBox", editorOptions: { items: [2021, 2022], showSelectionControls: true } },
          { fieldName:"chartType", label:"Chart Tipi", editorType:"dxSelectBox" , editorOptions:{
            items:[
              { label: "Bar", value: "bar" }, 
              { label: "Çizgi", value: "line" }, 
              { label: "Yumuşak Çizgi", value: "spline" },
              { label: "Alan", value: "area" }, 
              { label: "Yumuşak Alan", value: "splineArea" }
            ],

            displayExpr:"label",
            valueExpr:"value",
          
          }}
          ]}
          applyFilter={applyFilter} initialData={initialFilterData} />
        <br/>  
        <TabPanel

          dataSource={hotelData}
          //selectedIndex={selectedIndex}
          //onOptionChanged={e=>setSelectedIndex(e.value)}
          loop={true}
          // itemTitleRender={this.itemTitleRender}
          itemComponent={e => <ChartArea data={e.data} years={filter.years} chartType={filter.chartType}></ChartArea>}
          animationEnabled={true}
          swipeEnabled={true}
        />
      
        {/* <TagBox items={[2020,2021,2022]}
              value={filter.years}
              placeholder="Yıllar ..."
              showSelectionControls={true}
              onValueChanged={(e) => setFiter({ ...filter, years: e.value })}
              applyValueMode="useButtons" /> */}


      </div>
    </React.Fragment>
  )
}


const ChartArea = ({ data, years,chartType }) => {

  // const [chartType,setChartType]=React.useState("line")
  
  React.useEffect(()=>{

  },[chartType])

  return (
    <div>
      <div className="tabpanel-item" style={{height:"auto"}}> 
        <Chart id="chart-lines"  palette="Pastel" dataSource={data.data} title={data.title}>
          <Export enabled={true} />

          {
            years.map((e,index)=>(
              //'Bright' | 'Harmony Light' | 'Ocean' | 'Pastel' | 'Soft' | 'Soft Pastel' | 'Vintage' | 'Violet' | 'Carmine' | 'Dark Moon' | 'Dark Violet' | 'Green Mist' | 'Soft Blue' | 'Material' | 'Office'
              <Series key={index} pane="topPane" argumentField="processDate" type={chartType} valueField={e+data.field} name={e+"-"+data.title} />
            ))
          }
{/*           
          <Series pane="topPane" argumentField="processDate" type={chartType} valueField="2022pax" name="2022 Satılan Oda" />
          <Series pane="centerPane" argumentField="processDate" type="area" valueField="pax" name="Pax Sayısı" />
          <Series pane="bottomPane" argumentField="processDate" type="area" valueField="incomeSumEUR" axis="incomeSumEUR" name="Gelir" />
          <Series pane="bottom1Pane" argumentField="processDate" type="spline" valueField="occupancy" axis="occupancy" name="Doluluk %" /> */}

          {/* <ValueAxis
    title="Gelir (EUR)"
    name="incomeSumEUR"
    position="left"
  >
    <Grid visible={true} />
  </ValueAxis>
  <ValueAxis
    name="occupancy"
    position="right"
    title="Doluluk %"
  >
    <Grid visible={true} />
  </ValueAxis> */}
          <Pane name="topPane"   />
          {/* <Pane name="centerPane" height={(window.innerHeight - 285) / 4} />
  <Pane name="bottomPane" height={(window.innerHeight - 285) / 4} />
  <Pane name="bottom1Pane" height={(window.innerHeight - 285) / 4} /> */}

          <Margin left={window.innerWidth > 1080 ? 50 : 10} right={window.innerWidth > 1080 ? 50 : 10} />

          <ArgumentAxis defaultVisualRange={{ startValue: dateFilter1, endValue: dateFilter2 }} >
            <Grid visible={true} />
          </ArgumentAxis>

          <ScrollBar visible={true} />
          <ZoomAndPan argumentAxis="both" />
          <Legend verticalAlignment="bottom" horizontalAlignment="center" />
          {/* <ValueAxis pane="topPane">
            <Title text="Oda Satış" />
          </ValueAxis>
          <ValueAxis pane="centerPane">
            <Title text="Pax Sayısı" />
          </ValueAxis> */}

          <Tooltip
            enabled={true}
            shared={true}
            contentRender={TooltipTemplate}
          //customizeTooltip={customizeTooltip}
          >

          </Tooltip>


        </Chart>
        {/* <div className="options">
          <div className="caption">Seçenekler</div>
          <div className="option">
            <span>Chart Tipi </span>
            <SelectBox items={[
              { label: "Bar", value: "bar" }, 
              { label: "Çizgi", value: "line" }, 
              { label: "Yumuşak Çizgi", value: "spline" },
              { label: "Alan", value: "area" }, 
              { label: "Yumuşak Alan", value: "splineArea" }
            ]}

            displayExpr="label" valueExpr="value"
            value={chartType}
            onSelectionChanged={e=>setChartType(e.selectedItem.value)}
            placeholder="Grafik Tipi" />
          </div>
        </div> */}
        
      </div></div>

  )
}

const formatNumber = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0
}).format;

const formatNumber1Digit = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 1
}).format;

function TooltipTemplate(node) {
  var dataArray = node.points;
  return (
    <div className="dash-tooltip">
      <div className="state-tooltip" style={{ marginBottom: '2px' }}>
        <h4 className="state">{node.argument}</h4>
        <hr className="dash-tooltip-line" />
        <table className={"dash-tooltip-table"}>
          <tbody style={{ border: '1px solid white;' }}>

            {
              dataArray.map(e=>(

                <tr style={{ color: e.point.getColor() }}>
                  <td style={{ width: '50%' }}>{e.seriesName}</td>
                  <td style={{ width: '5%' }}>:</td>
                  <td >{formatNumber1Digit(e.value)}</td>
                </tr>
              ))
            }

            
          </tbody>
        </table>
      </div>
    </div>
  );

}