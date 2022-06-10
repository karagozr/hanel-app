import React from 'react';
import PropTypes from 'prop-types';
import RangeSelector, {
    Size,
    Chart as ChartOptions,
    Margin,
    Scale, 
    MinorTick, 
    SliderMarker,
    Behavior,
    CommonSeriesSettings as CommonSeriesSettingsOptions,
    Series as RsChartSeries
} from 'devextreme-react/range-selector';

var now = new Date();
const date1 = new Date(now.getFullYear(), 0, 1);
const date2 = new Date(now.getFullYear()+1, 0, 1);

const defaultDate1 = new Date(now.getFullYear(), now.getMonth(), 1);
const defaultDate2 = new Date(now.getFullYear(), now.getMonth(), 31);


const Chart = ({ data, updateRange,chartOption }) => {
    
    const {argumentField,valueField,type} = chartOption;

    React.useEffect(()=>{

    },[data])


    return (
        <div className={'range-selector-chart'}>
            {data!==[]&&<RangeSelector
                className={"range-selector"}
                dataSource={data}
                onValueChanged={updateRange}
                //value={rangeValue}
                defaultValue={[defaultDate1,defaultDate2]}
            >
                
                <Scale startValue={date1} endValue={date2}  minorTickInterval="day" minRange="day" maxRange="year">
                    <MinorTick visible={false} />
                </Scale>
                <Margin right={5} left={5} />
                <Size height={120} />
                <Behavior callValueChanged="onMoving" />
                <ChartOptions palette="Harmony Light"> 
                    {/* <Legend verticalAlignment="bottom" horizontalAlignment="center" /> */}
                    <RsChartSeries argumentField={argumentField} type={type} valueField={valueField} />
                    
                    <CommonSeriesSettingsOptions type="bar" ignoreEmptyPoints={true} />
                </ChartOptions>
                <SliderMarker format="monthAndDay" />
            </RangeSelector>}
        </div>

    );
}


Chart.propTypes = {
    data: PropTypes.array.isRequired,
    updateRange: PropTypes.func,
    chartOption : PropTypes.shape({
        argumentField: PropTypes.string.isRequired,
        valueField: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired
    }).isRequired,
    scaleData:PropTypes.shape({
        firstDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired
    }).isRequired,
    defaultValue:PropTypes.array
};

Chart.defaultProps = {
    data: [],
    updateRange: ({ value }) => console.log("range value : ",value),
    chartOption: {type:'line'},
    scaleData: {firstDate:date1,lastDate:date2},
    defaultValue:[defaultDate1,defaultDate2]
}

export const RangeSelectorChart = React.memo(Chart);
