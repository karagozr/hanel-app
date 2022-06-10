import React, { useState, useEffect, useRef } from 'react';
import { Popup, ToolbarItem } from 'devextreme-react/popup';
import DataGrid, { Column, SearchPanel, Paging } from 'devextreme-react/data-grid';
import { Form, SimpleItem, Label, RequiredRule as FormRequiredRule, EmailRule } from 'devextreme-react/form';

import { useGuide } from '../../contexts/hooks'

const List = ({ onSelect, data, height }) => {
    //console.log(document.getElementById('modal-content').clientHeight)
    return (
        <DataGrid
            id="gridContainer"

            dataSource={data}
            allowColumnReordering={true}
            showBorders={true}
            rowAlternationEnabled={true}
            height={height}
            onRowDblClick={({ data }) => onSelect(data)}>

            <Paging enabled={true} pageSize={30} />
            <SearchPanel visible={true} highlightCaseSensitive={true} />
            <Column dataField="cariKodu" caption="Kod" />
            <Column dataField="cariUnvan" caption="Unvan" />
            <Column dataField="vkn" caption="Vkn" />

        </DataGrid>
    )
}

const Editor = ({ formRef, formData }) => {
    return (
        <React.Fragment>
            <form id="mainForm" key="mainEditForm" onSubmit={(e) => console.log(e)}>

                <Form showColonAfterLabel={false} id={'formCariId'} ref={formRef}
                    showValidationSummary={true} scrollingEnabled={false} colCount={6} formData={formData} >

                    <SimpleItem colSpan={2} dataField="id">
                        <Label showColon={true} location={'top'} text="Cari Kodu" />
                        <FormRequiredRule message="Cari kodu alanı boş geçilemez !" />
                    </SimpleItem>

                    <SimpleItem colSpan={3} dataField="name">
                        <Label showColon={true} location={'top'} text="Cari Unvan/Ad" />
                        <FormRequiredRule message="Cari Unvan/Ad alanı boş geçilemez !" />
                    </SimpleItem>

                    <SimpleItem colSpan={1} editorType="dxSelectBox" editorOptions={{
                        items: ['S', 'A'], searchEnabled: true, value: 'S'
                    }}
                        dataField="cariType"  >
                        <Label showColon={true} location={'top'} text="Cari Tipi" />
                        <FormRequiredRule message="Cari Tipi alanı boş geçilemez !" />
                    </SimpleItem>

                    <SimpleItem colSpan={2} dataField="taxNumber">
                        <Label showColon={true} location={'top'} text="Vergi Numarası" />
                        <FormRequiredRule message="Vergi Numarası alanı boş geçilemez !" />
                    </SimpleItem>
                    <SimpleItem colSpan={2} dataField="taxRoom">
                        <Label showColon={true} location={'top'} text="Vergi Dairesi" />
                        <FormRequiredRule message="Vergi Dairesi alanı boş geçilemez !" />
                    </SimpleItem>
                    <SimpleItem colSpan={2} dataField="idNumber">
                        <Label showColon={true} location={'top'} text="T.C. Kimlik Num." />
                        <FormRequiredRule message="T.C. Kimlik Num. alanı boş geçilemez !" />
                    </SimpleItem>

                    <SimpleItem colSpan={2} dataField="city">
                        <Label showColon={true} location={'top'} text="İl (Şehir)" />
                    </SimpleItem>
                    <SimpleItem colSpan={2} dataField="district">
                        <Label showColon={true} location={'top'} text="İlçe" />
                    </SimpleItem>


                    <SimpleItem colSpan={1} dataField="eMail">
                        <Label showColon={true} location={'top'} text="E-Posta" />
                        <EmailRule message="Böyle E-Posta olmaz!!!" />
                    </SimpleItem>
                    <SimpleItem colSpan={1} dataField="phoneNo">
                        <Label showColon={true} location={'top'} text="Telefon" />
                    </SimpleItem>

                    <SimpleItem colSpan={6} dataField="adress">
                        <Label showColon={true} location={'top'} text="Adres" />
                    </SimpleItem>


                    <SimpleItem colSpan={3} dataField="description1">
                        <Label showColon={true} location={'top'} text="Açıklama - 1" />
                    </SimpleItem>
                    <SimpleItem colSpan={3} dataField="description2">
                        <Label showColon={true} location={'top'} text="Açıklama - 2" />
                    </SimpleItem>
                    <SimpleItem colSpan={6} dataField="description3">
                        <Label showColon={true} location={'top'} text="Açıklama - 3" />
                    </SimpleItem>

                </Form>

            </form>

        </React.Fragment>
    )
}

export const CariGuide = ({ open, onClose, onSelect }) => {
    const modal = useRef();
    const editFormRef = useRef();
    const [editorMode, setEditorMode] = useState(false);
    const [data, setData] = useState([]);
    const [formData] = useState({});
    const guide = useGuide();
    const [setContentHeight] = useState(0);

    useEffect(() => {
        if (open) {
            guide.getCariList().then(x => {
                setData(x.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    const handlePopupContent = (e) => {

        let popupContentHeight = document.getElementsByClassName('dx-popup-content')[0] === undefined || document.getElementsByClassName('dx-popup-content')[0].clientHeight === 0 ? (document.getElementsByClassName('dx-popup-content')[1].clientHeight) - 30 : (document.getElementsByClassName('dx-popup-content')[0].clientHeight) - 30;
        setContentHeight(popupContentHeight);
        //console.log("handlePopupContent : ",document.getElementsByClassName('dx-popup-content'));
    }

    const saveData = async () => {
        var res = await guide.addCari(formData);

        if (res.status === 200) {
            onSelect({
                cariKodu: formData.id,
                cariUnvan:formData.name,
                tckn: formData.idNumber,
                vergiDairesi: formData.taxRoom,
                vkn: formData.taxNumber
            })
        }

    }

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
            onShown={handlePopupContent}
            onResizeEnd={handlePopupContent}
            showCloseButton={true}>
            <div id={"modal-content"} style={{ height: '100%' }}>
                {editorMode === false ? (<List data={data} height={"100%"} onSelect={onSelect} />) : <Editor formRef={editFormRef} formData={formData} />}
            </div>

            <ToolbarItem
                visible={editorMode}
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={{
                    icon: 'save',
                    type: 'success',
                    text: 'Kaydet',
                    onClick: (e) => editFormRef.current.instance.validate().isValid && saveData()
                }}
            />
            <ToolbarItem location='before'
                widget='dxButton'
                options={{
                    stylingMode: 'text',
                    icon: !editorMode ? "edit" : "rowfield",
                    text: !editorMode ? "Yeni Cari" : "Liste",
                    onClick: (e) => setEditorMode(!editorMode)
                }} />

        </Popup>

    );
}
