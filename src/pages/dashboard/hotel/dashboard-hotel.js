import React from "react";
import {useHotelData} from '../../../contexts/hooks'
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

var now = new Date();
const dateFilter1 = new Date(now.getFullYear(), now.getMonth(), 1);
const dateFilter2 = now.getMonth() === 11 ? new Date(now.getFullYear() + 1, 0, 1) : new Date(now.getFullYear(), now.getMonth() + 1, 1);


export const HotelDashboard = () => {
    const hotel = useHotelData();
    const [hotelData, setHotelData] = React.useState([]);

    React.useEffect(() => {
        hotel
            .getRoomSaleSumData()
            .then(({data}) => {
                for(var i=0;i<data.length;i++){
                  data[i].processDate=new Date(data[i].processDate);
                }
                console.log("data : ", data)
                setHotelData(data);
            })
    }, [])

    return (
        <React.Fragment>
            <Chart id="chart-lines" palette="Harmony Light" dataSource={hotelData} title="Otel Günlük Akış">
          <Export enabled={true} />
          
        <Series pane="topPane"    argumentField="processDate" type="line" valueField="roomSum"      name="Satılan Oda" />
        <Series pane="centerPane" argumentField="processDate" type="line" valueField="pax"          name="Pax Sayısı" />
        <Series pane="bottomPane" argumentField="processDate" type="line" valueField="incomeSumEUR" name="Gelir (EUR)" />

        <Pane name="topPane" height={(window.innerHeight-285)/3}/>
        <Pane name="centerPane" height={(window.innerHeight-285)/3}/>
        <Pane name="bottomPane" height={(window.innerHeight-285)/3}/>
        <Margin left={window.innerWidth>1080?50:10} right={window.innerWidth>1080?50:10} />
        <ArgumentAxis defaultVisualRange={{ startValue: dateFilter1, endValue: dateFilter2 }} />
        <ScrollBar visible={true} />
        <ZoomAndPan argumentAxis="both" />
        <Legend verticalAlignment="bottom" horizontalAlignment="center" />
        <ValueAxis pane="topPane">
          <Grid visible={true} />
          <Title text="Oda Satış" />
        </ValueAxis>
        <ValueAxis pane="centerPane">
          <Grid visible={true} />
          <Title text="Pax Sayısı" />
        </ValueAxis>
        <ValueAxis pane="bottomPane">
          <Grid visible={true} />
          <Title text="Gelir" />
        </ValueAxis>
        <Tooltip
          enabled={true}
          shared={true}
          customizeTooltip={customizeTooltip}
        >
          
        </Tooltip>
      </Chart>

        </React.Fragment>
    )
}

function customizeTooltip(pointInfo) {
  console.log(pointInfo)
  const items = pointInfo.valueText.split('\n');
  const color = pointInfo.point.getColor();

  items.forEach((item, index) => {
    if(item.indexOf(pointInfo.seriesName) === 0) {
      const element = document.createElement('span');

      element.textContent = item;
      element.style.color = color;
      element.className = 'active';

      items[index] = element.outerHTML;
    }
  });

  return { text: 'Tarih:'+pointInfo.argument.toLocaleDateString("tr-TR")+'\n'+items.join('\n') };
}

