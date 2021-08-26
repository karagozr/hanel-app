import React,{useState} from 'react';
import { Popup } from 'devextreme-react/popup';
import DataGrid, { Column, SearchPanel, Paging, FilterRow } from 'devextreme-react/data-grid';

const data=[
    {cariKodu:"100-20-5001", cariUnvan:"KARYA TECH", vkn:"998452241"},
    {cariKodu:"100-20-5002", cariUnvan:"KARYA SOFTWARE", vkn:"998452245"},
    {cariKodu:"100-20-5003", cariUnvan:"KARYA ENERGY", vkn:"745656556"}
]

const List=({onSelect})=>{
    return(
        <DataGrid
            id="gridContainer"
            dataSource={data}
            allowColumnReordering={true}
            showBorders={true}
            rowAlternationEnabled={true}
            onRowDblClick={({data})=>onSelect(data)}>

            <Paging enabled={true} />
            <SearchPanel visible={true} highlightCaseSensitive={true}/>
            <Column dataField="cariKodu" caption="Kod" />
            <Column dataField="cariUnvan" caption="Unvan"/>
            <Column dataField="vkn" caption="Vkn"/>
            <FilterRow visible={true}></FilterRow> 
        </DataGrid>
    )
}

const editor=()=>{
    return(
        <h1>Edit</h1>
    )
}

export const MuhasebeKodGuide=({open,onClose,onSelect}) => {

    const [editorMode,setEditorMode]=useState(false);

    

    return (
        <Popup
          visible={open}
          onHiding={onClose}
          dragEnabled={true}
          closeOnOutsideClick={false}
          showTitle={true}
          resizeEnabled={true}
          title="Stok Rehberi"
          
          toolbarItems={
              [{
                location: 'before',
                widget: 'dxButton',
                options: {
                    stylingMode:'text',
                    icon:!editorMode ?"edit":"rowfield",
                    text:!editorMode ?"Yeni Stok":"Liste",
                    onClick:(e)=>setEditorMode(!editorMode)
                }
              }]}
          showCloseButton={true}>
            <div>
                {editorMode===false?(<List onSelect={onSelect}/>):editor()}
            </div>
            
        </Popup>
    );
}
