import React from 'react';
import PropTypes from 'prop-types';
import SelectBox from 'devextreme-react/select-box';
import TreeMap, { Tooltip } from 'devextreme-react/tree-map';

const Chart = ({ data, title, topNrange, toolTipTemplate,colorOptionName,calculateOthers }) => {
    const [selectedTopN, setTopN]=React.useState(topNrange.defaultValue);
    const [typeOptions]=React.useState(colorizationOptions.filter(x=>x.name===colorOptionName)[0].options);
    const [treeData, setTreeData] = React.useState(data);


    const toplist=()=>{
        var list=[];
        for(var i=topNrange.minValue;i<=topNrange.maxValue;i=i+topNrange.step){
            list.push(i);
        }
        return list; 
    }

    React.useEffect(()=>{
        const arrayLength = data.length;
        var filteredData = Object.assign(data.sort((x,y)=>y.value-x.value).slice(0, selectedTopN-1));
        var otherData = calculateOthers(Object.assign(data.sort((x,y)=>y.value-x.value).slice(selectedTopN-1,arrayLength )));
        console.log(title,otherData)
        setTreeData([...filteredData,otherData]);
    },[data, title, selectedTopN, toolTipTemplate,colorOptionName,calculateOthers])

    const topNvalueChanged = ({value})=>{
        const arrayLength = data.length;
        var filteredData = Object.assign(data.sort((x,y)=>y.value-x.value).slice(0, value-1));
        var otherData = calculateOthers(Object.assign(data.sort((x,y)=>y.value-x.value).slice(value-1,arrayLength )));
        setTreeData([...filteredData,otherData]);
        setTopN(value);
    }

    return (
        <div className={'pie-chart'} style={{margin:"10px", maxWidth:750}}>
            <TreeMap dataSource={treeData} title={title} colorizer={typeOptions}>
                <Tooltip enabled={true} format="thousands" contentRender={toolTipTemplate} />
            </TreeMap>
            <div className="dx-field" style={{width:'120px', marginTop:10}}>
                <div className="dx-field-label" style={{width:'50px'}}>Top n : </div>
                <div className="dx-field-value">
                    <SelectBox items={toplist()} value={selectedTopN} onValueChanged={topNvalueChanged} />
                </div>
            </div>
        </div>

    );
}


export const colorizationOptions = [{
    name: 'harmony-light',
    options: {
      type: 'discrete',
      palette: 'Harmony Light',
      colorizeGroups: false
    }
  }, {
    name: 'soft-pastel',
    options: {
      type: 'discrete',
      palette: 'Soft Pastel',
      colorizeGroups: false
    }
  }];

Chart.propTypes = {
    topNrange: PropTypes.shape({
        minValue: PropTypes.number.isRequired,
        maxValue: PropTypes.number.isRequired,
        step: PropTypes.number.isRequired,
        defaultValue: PropTypes.number.isRequired
    }).isRequired,
    data:PropTypes.array.isRequired,
    toolTipTemplate:PropTypes.func,
    colorOptionName:PropTypes.string,
    calculateOthers:PropTypes.func
};

Chart.defaultProps = {
    topNrange: {minValue:1,maxValue:10,step:1,defaultValue:5},
    data: [],
    toolTipTemplate:({node}) => {
        return (
            <div>
                <h4 className="state">{node.data.name}</h4>
                <div className="state-tooltip">
                    <span>{node.data.value} </span>
                </div>
            </div>
          
        );
    },
    colorOptionName:"harmony-light",
    calculateOthers:(data)=>({})
}

export const TreeChart = Chart