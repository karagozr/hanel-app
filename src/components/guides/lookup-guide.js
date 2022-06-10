import React, { useState, useRef } from 'react';
import DataGrid, {
  Column,
  Scrolling,
  Selection,
  FilterRow
} from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';

const dropDownOptions = { width: window.innerWidth < 1081 ? window.innerWidth * 0.9 : window.innerWidth * 0.3 };

export const LookUpGuide = ({columns,dataSource,currValue,valueExpr,displayExpr}) => {

  const [currentValue, setCurrentValue] = useState(currValue);
  const dropDownBoxRef = useRef();

  console.log("dataSource : ",dataSource);

  React.useEffect(() => {

  }, [])

  const onSelectionChanged = (selectionChangedArgs) => {
   
    setCurrentValue(selectionChangedArgs.selectedRowKeys[0]);
    //setValue(selectionChangedArgs.selectedRowKeys[0]);
    if (selectionChangedArgs.selectedRowKeys.length > 0) {
      dropDownBoxRef.current.instance.close();
    }

    // onSelectedValueChanged(selectionChangedArgs.selectedRowsData[0]);
  }

  const contentRender = () => {
    return (
      <React.Fragment>

        <DataGrid
          dataSource={dataSource}
          remoteOperations={true}
          keyExpr={valueExpr}
          height={250}
          columnAutoWidth={true}
          selectedRowKeys={[currentValue]}
          hoverStateEnabled={true}
          onSelectionChanged={onSelectionChanged}
          focusedRowEnabled={true}
          defaultFocusedRowKey={currentValue}>

          <FilterRow visible={true} />

          {columns.map((item, index) => (
                            <Column key={index+1}
                                tabIndex={-1}
                                dataField={item}
                                //caption={caption}
                                // format={format}
                                // dataType={dataType}
                                />
                        ))}

          <Scrolling mode="virtual" />
          <Selection mode="single" />
        </DataGrid>
      </React.Fragment>

    );
  }

  return (
    <React.Fragment>
      <DropDownBox
        ref={dropDownBoxRef}
        dropDownOptions={dropDownOptions}
        dataSource={dataSource}
        value={currentValue}
        displayExpr={displayExpr}
        valueExpr={valueExpr}
        contentRender={contentRender}>
      </DropDownBox>
    </React.Fragment>

  );
}
