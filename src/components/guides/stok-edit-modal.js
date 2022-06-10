import React from 'react';
import { Popup,ToolbarItem } from 'devextreme-react/popup';
import { Form, SimpleItem, Label,  RequiredRule as FormRequiredRule } from 'devextreme-react/form';

import {useGuide} from '../../contexts/hooks'
import {LookUpGuide} from './lookup-guide'

export const StokEditModal=({open,onClose}) => {
    const formRef = React.useRef();
    const formData = React.useState({});

    const guide = useGuide();

    const [branchData, setBranchData] = React.useState([]);
    const [code1Data, setCode1Data] = React.useState([]);
    const [groupCode1Data, setGroupCode1Data] = React.useState([]);
    const [accountingDetailCodeData, setAccountingDetailCodeData]= React.useState([]);

    
    const fetchData = async () =>{

            if(branchData.length===0){
                var result1 = await guide.getSubeList(null);
                setBranchData(result1.data.map((item)=>({branchCode:item.subeKodu, description:item.subeKodu+'-'+item.unvan})));
            }
            if(code1Data.length===0){
                var result2 = await guide.getStockCode1List();
                setCode1Data(result2.data.map(item=>({code:item.code, description:item.code+'-'+item.description})));
            }
            if(groupCode1Data.length===0){
                var result3 = await guide.getStockGroupCode1List();
                setGroupCode1Data(result3.data.map(item=>({code:item.code, description:item.code+'-'+item.description})));
            }
            if(accountingDetailCodeData.length===0){
                var result4 = await guide.getStockAccDetailKodList();
                setAccountingDetailCodeData(result4.data);
            }
        }
    

    React.useEffect(()=>{
        var fetchModal = () =>fetchData();
        if(open){
            fetchModal();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[open])

    

    return (
        <Popup
          visible={open}
          onHiding={onClose}
          dragEnabled={true}
          closeOnOutsideClick={false}
          showTitle={true}
          resizeEnabled={true}
          title="Stok Ekle/Düzenle"
        
          showCloseButton={true}>
            <div>
            <form id="mainForm" key="mainEditForm" >

                <Form showColonAfterLabel={false} id={'formCariId'} ref={formRef}
                    showValidationSummary={true} scrollingEnabled={false} colCount={6} formData={formData} >

                    <SimpleItem colSpan={2} dataField="id">
                        <Label showColon={true} location={'top'} text="Stok Kodu" />
                        <FormRequiredRule message="Cari kodu alanı boş geçilemez !" />
                    </SimpleItem>

                    <SimpleItem colSpan={4} dataField="name">
                        <Label showColon={true} location={'top'} text="Stok Adı" />
                        <FormRequiredRule message="Stok Adı alanı boş geçilemez !" />
                    </SimpleItem>

                    <SimpleItem colSpan={3} editorType="dxSelectBox" component={(props)=>LookUpGuide({...props, columns:['code','description'], dataSource:groupCode1Data, currValue:formData.groupCode1 ,
                    valueExpr:'code', displayExpr:'description'})}
                    editorOptions={{
                        displayExpr: "description", valueExpr: "code"
                    }} 
                    dataField="grupCode"  >
                        <Label showColon={true} location={'top'} text="Stok Grup" />
                        <FormRequiredRule message="Stok Grup alanı boş geçilemez !" />
                    </SimpleItem>

                    <SimpleItem colSpan={3} editorType="dxDropDownBox" component={(props)=>LookUpGuide({...props, columns:['code','description'], dataSource:code1Data, currValue:formData.code1 ,
                    valueExpr:'code', displayExpr:'description'})} 
                    editorOptions={{
                        displayExpr: "description", valueExpr: "code"
                    }} 
                    dataField="code1"  >
                        <Label showColon={true} location={'top'} text="Kod-1" />
                        <FormRequiredRule message="Kod-1 alanı boş geçilemez !" />
                    </SimpleItem>
                   

                    {/* <SimpleItem colSpan={3} editorType="dxSelectBox" editorOptions={{
                        items: branchData, searchEnabled: true, value:formData.accoutingCodeBranch ,displayExpr: "description", valueExpr: "branchCode"
                    }} dataField="accoutingCodeBranch"  >
                        <Label showColon={true} location={'top'} text="Muhasebe Datey Şube Kodu" />
                        <FormRequiredRule message="Muhasebe Datey Şube Kodu alanı boş geçilemez !" />
                    </SimpleItem> */}

                    <SimpleItem colSpan={3} editorType="dxSelectBox" component={(props)=>LookUpGuide({...props, columns:['branchCode','branchName','code','description'], dataSource:accountingDetailCodeData, currValue:formData.accoutingCode ,
                    valueExpr:'code', displayExpr:'description'})} editorOptions={{
                        items: accountingDetailCodeData, searchEnabled: true, value:formData.grupCode ,displayExpr: "description", valueExpr: "code"
                    }} dataField="accoutingCode"  >
                        <Label showColon={true} location={'top'} text="Muhasebe Detay Kodu" />
                        <FormRequiredRule message="Muhasebe Datey alanı boş geçilemez !" />
                    </SimpleItem>

                   

                    <SimpleItem colSpan={6} dataField="description1">
                        <Label showColon={true} location={'top'} text="Açıklama" />
                    </SimpleItem>
                 

                </Form>

            </form>
            </div>
            <ToolbarItem
                visible={true}
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={{
                    icon: 'save',
                    type: 'success',
                    text: 'Kaydet',
                    // onClick: (e) => editFormRef.current.instance.validate().isValid && saveData()
                }}
            />
        </Popup>
    );
}
