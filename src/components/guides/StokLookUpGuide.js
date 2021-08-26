import React, { useState,useRef } from 'react';
import DataGrid, {
  Column,
  Scrolling,
  Selection,
  FilterRow
} from 'devextreme-react/data-grid';
import DropDownBox from 'devextreme-react/drop-down-box';

const dropDownOptions = { width: window.innerWidth<1081? window.innerWidth*0.9: window.innerWidth*0.3};
 
export const StokLookUpGuide = (props) => {

    const [currentValue,setCurrentValue]=useState(props.data.value);
    const dropDownBoxRef = useRef();
    console.log("propas : ",props)

    

    const onSelectionChanged = (selectionChangedArgs) => {
        //console.log("propas : ",)
        //setCurrentRow(selectionChangedArgs.selectedRowsData[0])
        setCurrentValue(selectionChangedArgs.selectedRowKeys[0]);
        props.data.setValue(selectionChangedArgs.selectedRowKeys[0]);
        if(selectionChangedArgs.selectedRowKeys.length > 0) {
          dropDownBoxRef.current.instance.close();
        }

        props.onSelectedValueChanged(selectionChangedArgs.selectedRowsData[0]);
    }

    const contentRender=()=> {
        return (
        <DataGrid
            dataSource={props.data.column.lookup.dataSource}
            remoteOperations={true}
            keyExpr="stokKodu"
            height={250}
            selectedRowKeys={[currentValue]}
            hoverStateEnabled={true}
            onSelectionChanged={onSelectionChanged}
            focusedRowEnabled={true}
            defaultFocusedRowKey={currentValue}>
                
            <FilterRow visible={true} />
            
            <Column dataField="stokKodu" />
            <Column dataField="stokAdi" />

            <Scrolling mode="virtual" />
            <Selection mode="single" />
        </DataGrid>
        );
    }

    return (
        <DropDownBox
          ref={dropDownBoxRef}
          dropDownOptions={dropDownOptions}
          dataSource={props.data.column.lookup.dataSource}
          value={currentValue}
          displayExpr="stokAdi"
          valueExpr="stokKodu"
          contentRender={contentRender}>
        </DropDownBox>
      );
}
