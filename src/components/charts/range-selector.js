import React from 'react';
import PropTypes from 'prop-types';
import RangeSelector, {
    Size,
    Chart as ChartOptions,
    Margin,
    Legend,
    Behavior,
    CommonSeriesSettings as CommonSeriesSettingsOptions,
    Series as RsChartSeries
} from 'devextreme-react/range-selector';

const Chart = ({ data, updateRange,chartOption, value }) => {
    
    const rangeValue = value;
    const rangeData = data;
    const {argumentField,valueField,type} = chartOption;

    console.log('rangeData : ', rangeData)

    return (
        <div className={'range-selector-chart'}>
            <RangeSelector
                className={"range-selector"}
                dataSource={rangeData}
                onValueChanged={updateRange}
                value={rangeValue}
            >

                <Size height={120} />
                <Behavior callValueChanged="onMoving" />
                <ChartOptions palette="Harmony Light">
                    <Margin left={0} />
                    <Legend verticalAlignment="bottom" horizontalAlignment="center" />
                    <RsChartSeries argumentField={argumentField} type={type} valueField={valueField} />
                    <Legend visible={false} />
                    <CommonSeriesSettingsOptions type="bar" ignoreEmptyPoints={true} />
                </ChartOptions>
            </RangeSelector>
        </div>

    );
}


Chart.propTypes = {
    data: PropTypes.array.isRequired,
    value: PropTypes.array,
    updateRange: PropTypes.func,
    chartOption : PropTypes.shape({
        argumentField: PropTypes.number.isRequired,
        valueField: PropTypes.number.isRequired,
        type: PropTypes.number.isRequired
    }).isRequired,
};

Chart.defaultProps = {
    data: [],
    value:[],
    updateRange: ({ value }) => console.log("range value : ",value),
    chartOption: {type:'line'},
}

export const RangeSelectorChart = React.memo(Chart);
