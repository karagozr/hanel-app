import React,{useState,useEffect,useRef} from 'react';
import { Popup } from 'devextreme-react/popup';
import DataGrid, { Column, SearchPanel, Paging } from 'devextreme-react/data-grid';
import {useGuide} from '../../contexts/hooks'

const List=({onSelect,data,height})=>{
    //console.log(document.getElementById('modal-content').clientHeight)
    return(
        <DataGrid
            id="gridContainer"

            dataSource={data}
            allowColumnReordering={true}
            showBorders={true}
            rowAlternationEnabled={true}
            height={height-20}
            onRowDblClick={({data})=>onSelect(data)}>

            <Paging enabled={true} pageSize={20} />
            <SearchPanel visible={true} highlightCaseSensitive={true}/>
            <Column dataField="cariKodu" caption="Kod" />
            <Column dataField="cariUnvan" caption="Unvan"/>
            <Column dataField="vkn" caption="Vkn"/>
            
        </DataGrid>
    )
}

const editor=()=>{
    return(
        <h1>Edit</h1>
    )
}

export const CariGuide=({open,onClose,onSelect}) => {
    const modal = useRef();
    const [editorMode,setEditorMode]=useState(false);
    const [data, setData]=useState([]);
    const guide = useGuide();
    const [contentHeight,setContentHeight]=useState(0);
    
    useEffect(()=>{
        if(open){
            guide.getCariList().then(x=>{
                setData(x.data);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[open])

    document.getElementsByClassName('dx-popup-wrapper');
    

    return (
        <Popup
          visible={open}
          ref={modal}
          onHiding={onClose}
          dragEnabled={true}
          closeOnOutsideClick={false}
          showTitle={true}
          resizeEnabled={true}
          title="Cari Rehberi"
          onShown={(e)=>setContentHeight(document.getElementById('modal-content').clientHeight)}
          toolbarItems={
              [{
                location: 'before',
                widget: 'dxButton',
                options: {
                    stylingMode:'text',
                    icon:!editorMode ?"edit":"rowfield",
                    text:!editorMode ?"Yeni Cari":"Liste",
                    onClick:(e)=>setEditorMode(!editorMode)
                }
              }]}
          showCloseButton={true}>
            <div id={"modal-content"} style={{height:'100%'}}>
                {editorMode===false?(<List data={data} height={contentHeight} onSelect={onSelect}/>):editor()}
            </div>
            
        </Popup>
        
    );
}
