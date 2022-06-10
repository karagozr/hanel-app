import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Form, SimpleItem, Label, RangeRule, RequiredRule as FormRequiredRule, Item } from 'devextreme-react/form';
import DataGrid, { Column, Editing, Paging, Lookup, Summary, RequiredRule, TotalItem, Toolbar as DxToolbar, Item as DxToolbarItem, Scrolling } from 'devextreme-react/data-grid';
import { TextBox, Button as TextBoxButton } from 'devextreme-react/text-box';
import { Button } from 'devextreme-react/button';
import { confirm } from 'devextreme/ui/dialog';

import { useGuide, useInvoice } from '../../contexts/hooks'
import { CariGuide, HesapKodLookUp, StokLookUpGuide, ExportExcel, ImportExcel, StokEditModal } from '../../components'
import { useActionButton, useLoad } from '../../contexts'
import { addActionButton, openMultiLoad } from '../../contexts/actions'
import { YevmiyeFisModal } from '../../components'
import axios from 'axios'
import { Button as DevButton, ScrollView, SelectBox } from 'devextreme-react';


let today = new Date();


let defaultFormData = {
    guid: "",
    faturaTarihi: today,
    cariKodu: "",
    subeKodu: "",
    faturaNo: "",
    aciklama: "",
    aciklama2: "",
    projeKodu: "",
    returnYevmiyeFisi: true,
    invoiceStatus: 0,
    faturaDetays: []
}

const excelColumns = [
    { label: "Stok Kodu", value: "stokKodu" },
    { label: "Miktar", value: "miktar" },
    { label: "Fiyat", value: "fiyat" },
    { label: "Kdv %", value: "kdv" },
    { label: "Açıklama", value: "kalemAciklama" },
    { label: "Muhasebe Kodu", value: "muhasebeKodu" },
    { label: "Proje Kodu", value: "projeKodu" },
    { label: "Referans Kodu", value: "referansKodu" }
]

export const InvoiceEdit = React.memo(({ invoiceGuid }) => {

    const formRef = React.useRef();

    const load = useLoad();
    const guide = useGuide();
    const invoice = useInvoice();

    const [formData, setFormData] = useState(defaultFormData);

    const [yevmiyeFisData, setYevmiyeFisData] = useState([]);
    const [yevmiyeFisOpen, setYevmiyeFisOpen] = useState(false);

    const [stokEditModalOpen, setStokEditModalOpen] = useState(false);


    const actionButton = useActionButton();

    const [subeData, setSubeData] = useState([])
    const [stokCards, setStokCards] = useState([])
    const [hesapData, setHesapData] = useState([])
    const [refKodData, setRefKodData] = useState([])
    const [projeKodData, setProjeKodData] = useState([])
    const dataGridRef = useRef();
    const history = useHistory();





    const onCariSelected = (data) => {

        var returnedTarget = Object.assign(formData, { cariKodu: data.cariKodu, cariUnvan: data.cariUnvan });
        setFormData(returnedTarget);
        setCariGuideOpen(false);
    }

    const downloadYevmiyeFisi = async () => {
        await invoice.saveYevmiyeFisi(yevmiyeFisData.faturaNo, yevmiyeFisData.cariKodu);
    }

    const SaveInvoice = () => {


        invoice.saveInvice(formData).then((result) => {
            var { status } = result;

            if (status === 409) {
                confirm("<i>Fatura daha önce kaydedilmiş. Eski kayıt silinip, yenisi eklenecek. Onay veriyor musunuz?</i>", "Uyarı").then((dialogResult) => {
                    if (!dialogResult) return;
                    setFormData(Object.assign(formData, { guncelleme: true }));
                    SaveInvoice();
                })
            } else if (status === 201) {
                setYevmiyeFisData(result.data);
                var _listData = JSON.parse(localStorage.getItem('invoice-data'));
                var _index = _listData.findIndex(x => x.guid === invoiceGuid);
                _listData[_index].faturaNo = result.data.faturaNo;
                _listData[_index].cariKodu = result.data.cariKodu;
                _listData[_index].kayitli = true;
                localStorage.setItem('invoice-data', JSON.stringify(_listData));
                setYevmiyeFisOpen(true);
                console.log("INVOICE SAVE : ", result)

            }
        }).catch((error) => {
            confirm(error, "Hata");
            return;
        });

    }


    const openYevmiyeFisi = (e) => {
        invoice.getYevmiyeFisi(formData.faturaNo, formData.cariKodu).then((result) => {

            setYevmiyeFisData(result);
            setYevmiyeFisOpen(true);

        }).catch((error) => {
            confirm(error, "Hata");
            return;
        });
    }
    const buttons = window.innerWidth > 1080 ? [] : [
        { icon: 'save', label: 'Kaydet', clickEvent: (e) => formRef.current.instance.validate().isValid && formRef.current.dispatchEvent(new Event("submit", { cancelable: true })) },
        { icon: 'orderedlist', label: 'Yevmiye Fişi', clickEvent: openYevmiyeFisi }
    ];

    useEffect(() => {

        async function fetchData() {
            load.dispatch(openMultiLoad(true));
            var _faturaDatas = await invoice.getInvoice(invoiceGuid);
            console.log('_faturaDatas : ', _faturaDatas)

            const [_subeDatas, _stokDatas, _hkodDatas, _mRefDatas, _projeKodData] = await axios.all([
                guide.getSubeList(_faturaDatas ? _faturaDatas.vkn : null),
                guide.getStokList(),
                guide.getHesapKodList(),
                guide.getMuhasebeRefList(),
                guide.getProjeList()
            ]);


            var newFormData = Object.assign(formData, _faturaDatas);
            newFormData.returnYevmiyeFisi = true;


            _mRefDatas.data.forEach(element => {
                element.referansAdi = element.referansKodu + ' - ' + element.referansAdi
            });

            _projeKodData.data.forEach(element => {
                element.projeAdi = element.projeKodu + ' - ' + element.projeAdi
            });

            setFormData(newFormData);
            setSubeData(_subeDatas.data);
            setStokCards(_stokDatas.data);
            setHesapData(_hkodDatas.data);
            setRefKodData(_mRefDatas.data);
            setProjeKodData(_projeKodData.data);

            load.dispatch(openMultiLoad(false));
        }

        fetchData();
        actionButton.dispatch(addActionButton(buttons));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceGuid]);

    const [openCariGuide, setCariGuideOpen] = useState(false);

    const onStokSelectedValueChanged = (e) => {
        if (e !== undefined) {
            if (e.alisHesapKodu !== null) {
                dataGridRef.current.instance.cellValue(0, "muhasebeKodu", e.alisHesapKodu);
                dataGridRef.current.instance.saveEditData();
            } else {
                dataGridRef.current.instance.cellValue(0, "muhasebeKodu", '');
            }

            // if (e.kdvOrani !== null) {
            //     dataGridRef.current.instance.cellValue(0, "kdv", e.kdvOrani);
            //     dataGridRef.current.instance.saveEditData();
            // } else {
            //     dataGridRef.current.instance.cellValue(0, "kdv", 0);
            // }
            // if (e.miktar === null || e.miktar === undefined || e.miktar === 0) {
            //     dataGridRef.current.instance.cellValue(0, "miktar", 1);
            // }
        }
    }

    const onHesapKodSelectedValueChanged = (e) => { }

    const onEditorPreparing = (e) => {

        if (e.dataField === 'fiyat' || e.dataField === 'tutar' || e.dataField === 'miktar' || e.dataField === 'kdv' || e.dataField === 'kdvTutar') {

            e.editorOptions.onValueChanged = ({ value }) => {
                e.setValue(value);

                if ((e.row.data.projeKodu === undefined || e.row.data.projeKodu === "")) {
                    e.component.cellValue(e.row.rowIndex, "projeKodu", formData.projeKodu);
                }

                if (e.row.data.miktar === undefined) return;
                if (e.row.data.kdv === undefined) return;

                let miktar = e.dataField === 'miktar' ? value : e.row.data.miktar;
                let kdv = e.dataField === 'kdv' ? value : e.row.data.kdv;
                let kdvTutar = e.dataField === 'kdvTutar' ? value : e.row.data.kdvTutar;
                let fiyat = e.dataField === 'fiyat' ? value : e.row.data.fiyat;
                let tutar = e.dataField === 'tutar' ? value : e.row.data.tutar;


                let kdvTutarHesapla = () => {
                    if (e.dataField === 'fiyat') {
                        kdvTutar = kdv * ((fiyat * miktar) / 100);
                    } else if (e.dataField === 'tutar') {
                        kdvTutar = kdv * ((tutar / miktar * (100 / (100 + kdv)) * miktar) / 100);
                    } else if (e.row.data.fiyat !== undefined && e.row.data.fiyat !== 0) {
                        kdvTutar = kdv * ((fiyat * miktar) / 100);
                    } else if (e.row.data.tutar !== undefined && e.row.data.tutar !== 0) {
                        kdvTutar = kdv * ((tutar / miktar * (100 / (100 + kdv)) * miktar) / 100);
                    }

                    e.component.cellValue(e.row.rowIndex, "kdvTutar", kdvTutar);
                }


                if (e.dataField !== 'kdvTutar') {
                    kdvTutarHesapla();
                } else {
                    if (parseInt(kdvTutar) !== parseInt(fiyat * miktar * ((100 + kdv) / 100))) {
                        confirm("<i>Girilen kdv tutarı; hesaplanan tutardan 1 birim fiyat farklı. Onay veriyor musunuz?</i>", "Uyarı").then((dialogResult) => {
                            if (!dialogResult) {
                                kdvTutarHesapla();
                            };
                        })
                    }
                }

                if (e.dataField === 'fiyat')
                    e.component.cellValue(e.row.rowIndex, "tutar", (value * miktar + kdvTutar).toFixed(4));
                else if (e.dataField === 'tutar')
                    e.component.cellValue(e.row.rowIndex, "fiyat", ((value - kdvTutar) / miktar).toFixed(4));
                else if (e.row.data.fiyat !== undefined && e.row.data.fiyat !== 0)
                    e.component.cellValue(e.row.rowIndex, "tutar", (fiyat * miktar + kdvTutar).toFixed(4));
                else if (e.row.data.tutar !== undefined && e.row.data.tutar !== 0)
                    e.component.cellValue(e.row.rowIndex, "fiyat", ((tutar - kdvTutar) / miktar).toFixed(4));
            }
        }

        e.editorOptions.onOpened = function (arg) {
            var popupInstance = arg.component._popup;
            popupInstance.option('width', 350);
        }
    }


    const onToolbarPreparing = (e) => {
        e.toolbarOptions.items.unshift({
            location: 'after',
            widget: 'dxButton',
            options: {
                icon: 'exportselected',

            }
        }, {
            location: 'after',
            widget: 'dxButton'
        });
    }
    //const [excelData, setExcelData]=React.useState([]);

    const setExcelData = (data) => {
        console.log("data :Ç ", data)
        var dat = [...formData.faturaDetays, ...data];

        setFormData({ ...formData, faturaDetays: dat })
    }

    const handleChangeProjeKodu = (e) =>{

        setFormData({...formData,faturaDetays:formData.faturaDetays.map(e=>({ ...e,projeKodu : e.value}))})
        
    }



    return (
        <div>
            <YevmiyeFisModal data={yevmiyeFisData} open={yevmiyeFisOpen} onClose={(e) => setYevmiyeFisOpen(false)}
                downloadYevmiyeFisi={downloadYevmiyeFisi} />
            <CariGuide open={openCariGuide} onClose={(e) => setCariGuideOpen(false)} onSelect={onCariSelected} />
            <StokEditModal open={stokEditModalOpen} onClose={() => setStokEditModalOpen(false)} />

            <form id="mainForm" key="mainEditForm" onSubmit={SaveInvoice} >

                <Form showColonAfterLabel={false} id={'formId'} ref={formRef}
                    showValidationSummary={true} scrollingEnabled={false} colCount={4} formData={formData} >

                    <Item colSpan={4}>
                        {window.innerWidth > 1080 ? <div>
                            <DevButton
                                icon="save"
                                style={{ float: 'right', marginLeft: '5px' }}
                                //width={120}
                                text="Kaydet"
                                type="danger"
                                stylingMode="outlined"
                                onClick={(e) => formRef.current.instance.validate().isValid && SaveInvoice()}
                            />
                            <DevButton
                                icon="runner"
                                style={{ float: 'right', marginLeft: '5px' }}
                                //width={120}
                                text="Otomatikleştir"
                                type="default"
                                stylingMode="outlined"
                                onClick={(e) => formRef.current.instance.validate().isValid && SaveInvoice()}
                            />

                            <DevButton
                                icon="orderedlist"
                                style={{ float: 'right', marginLeft: '5px' }}
                                //width={120}
                                text="Yevmiye Fisi"
                                type="success"
                                stylingMode="outlined"
                                onClick={openYevmiyeFisi}
                            />
                            &nbsp;
                            <DevButton
                                icon="chevronleft"
                                style={{ float: 'left', marginLeft: '5px' }}
                                //width={120}
                                text="Listeye Dön"
                                type="normal"
                                stylingMode="outlined"
                                onClick={(e) => window.history.back()}
                            />
                        </div> : null}
                    </Item>
                    <SimpleItem colSpan={2} editorType="dxSelectBox" editorOptions={{
                        items: subeData, searchEnabled: true, value: formData.subeKodu, displayExpr: "unvan", valueExpr: "subeKodu"
                    }}
                        dataField="subeKodu"  >
                        <Label showColon={true} location={'top'} text="Şube" />
                        <FormRequiredRule message="Şube alanı boş geçilemez !" />
                    </SimpleItem>

                    <SimpleItem colSpan={1} dataField="faturaTarihi" editorType="dxDateBox" editorOptions={{ displayFormat: "dd/MM/yyyy" }}>
                        <Label showColon={true} location={'top'} text="Tarih" />
                        <FormRequiredRule message="Fatura tarihi alanı boş geçilemez !" />
                    </SimpleItem>
                    <SimpleItem colSpan={1} dataField="faturaNo">
                        <Label showColon={true} location={'top'} text="Fatura No" />
                        <FormRequiredRule message="Fatura numarası alanı boş geçilemez !" />
                    </SimpleItem>

                    <SimpleItem colSpan={2} dataField="cariKodu" editorOptions={{
                        value: formData.cariKodu,
                        displayExpr: "cariUnvan", valueExpr: "cariKodu"
                    }}
                        render={(e) => {
                            return (<TextBox
                                value={formData.cariUnvan}
                                onValueChanged={e => console.log("KEY OWN : ", formData.cariUnvan)}
                            >
                                <TextBoxButton
                                    name="cariKodu"
                                    location="after"
                                    options={{
                                        icon: 'more',
                                        stylingMode: 'text',
                                        onClick: (e) => setCariGuideOpen(true)
                                    }}
                                />
                            </TextBox>)
                        }}>
                        <Label showColon={true} location={'top'} text="Cari" />
                        <FormRequiredRule message="Cari alanı boş geçilemez !" />
                    </SimpleItem>
                    <SimpleItem colSpan={1} editorType="dxSelectBox" editorOptions={{
                        // onValueChanged:handleChangeProjeKodu,
                        items: projeKodData, searchEnabled: true, value: formData.projeKodu, displayExpr: "projeAdi", valueExpr: "projeKodu"
                    }}
                        dataField="projeKodu"  >
                        <Label showColon={true} location={'top'} text="Proje" />
                        <FormRequiredRule message="Proje alanı boş geçilemez !" />
                    </SimpleItem>
                    <SimpleItem colSpan={1} dataField="aboneNo" >
                        <Label showColon={true} location={'top'} text="Abone No" />
                    </SimpleItem>
                    <SimpleItem colSpan={2} dataField="aciklama" >
                        <Label showColon={true} location={'top'} text="Açıklama - 1" />
                    </SimpleItem>
                    <SimpleItem colSpan={2} dataField="aciklama2" >
                        <Label showColon={true} location={'top'} text="Açıklama - 2" />
                    </SimpleItem>
                    {/* <SimpleItem colSpan={1} dataField="yuvarlamaTutari" >
                        <Label showColon={true} location={'top'} text="Yuvarlama Tutarı" />
                    </SimpleItem> */}
                    <Item colSpan={4}>
                        <div id='grid-content' style={{ width: '100%' }}>
                            {document.getElementById('grid-content') !== null ? (
                                <DataGrid
                                    ref={dataGridRef}
                                    id="gridContainer"
                                    dataSource={formData.faturaDetays}
                                    allowColumnReordering={true}
                                    showBorders={true}
                                    onEditorPreparing={onEditorPreparing}
                                    columnAutoWidth={true}
                                    allowColumnResizing={true}
                                    
                                    // columnResizingMode={'widget'}
                                    // height={window.innerHeight*0.37}
                                // onToolbarPreparing={onToolbarPreparing}
                                >

                                    <Paging enabled={false} />
                                    <Scrolling columnRenderingMode="virtual" />


                                    <Editing
                                        mode="cell"
                                        allowAdding={true}
                                        allowUpdating={true}
                                        allowDeleting={true}
                                        selectTextOnEditStart={true}>

                                    </Editing>
                                    <Column dataField="stokKodu" caption="Stok" allowHiding={true} editCellComponent={
                                        (props) => StokLookUpGuide({ ...props, onSelectedValueChanged: onStokSelectedValueChanged })}>
                                        <Lookup
                                            dataSource={stokCards}
                                            displayExpr="stokAdi"
                                            valueExpr="stokKodu"
                                        />
                                    </Column>
                                    <Column dataField="miktar" caption="Miktar" dataType='number' format={{ type: "fixedPoint", precision: 2 }}>
                                        <RangeRule min={0.0} />
                                    </Column>
                                    <Column dataField="fiyat" caption="Fiyat" dataType='number' format={{ type: "fixedPoint", precision: 2 }} >
                                        
                                        <RangeRule min={0.0} />
                                    </Column>
                                    <Column dataField="kdv" caption="Kdv (%)" dataType='number' format={{ type: "fixedPoint", precision: 2 }}>
                                        
                                        <RangeRule min={0.0} max={100} />
                                    </Column>
                                    <Column dataField="kdvTutar" caption="Kdv Tut." dataType='number' format={{ type: "fixedPoint", precision: 2 }} >
                                        
                                        <RangeRule min={0.0} />
                                    </Column>
                                    <Column dataField="tutar" caption="Tutar" dataType='number'
                                        //calculateCellValue={tutarCalculate}
                                        format={{ type: "fixedPoint", precision: 2 }}>
                                        
                                    </Column>
                                    <Column dataField="kalemAciklama" caption="Açıklama">
                                    </Column>
                                    <Column dataField="projeKodu" caption="Proje Kod"
                                    //editCellComponent={(props) => ProjeKodLookUp({ ...props, onSelectedValueChanged: onProjeKodSelectedValueChanged })}
                                    >
                                        <Lookup
                                            
                                            dataSource={projeKodData}
                                            displayExpr="projeAdi"
                                            valueExpr="projeKodu"
                                        />

                                        {/* <Lookup dataSource={["P01", "P10", "P11", "P12"]} /> */}
                                        
                                    </Column>
                                    <Column dataField="referansKodu" caption="Ref. Kod"
                                    //editCellComponent={(props) => ReferansKodLookUp({ ...props, onSelectedValueChanged: onRefKodSelectedValueChanged })}
                                    >
                                        <Lookup
                                            dataSource={refKodData}
                                            displayExpr="referansAdi"
                                            valueExpr="referansKodu"
                                            editorOptions={{ width: 500 }}
                                        />
                                    </Column>
                                    <Column dataField="muhasebeKodu" caption="Muh. Kodu" editCellComponent={
                                        (props) => HesapKodLookUp({ ...props, onSelectedValueChanged: onHesapKodSelectedValueChanged })}>
                                        <Lookup
                                            width={200}
                                            dataSource={hesapData}
                                            displayExpr="hesapAdi"
                                            valueExpr="hesapKodu" />
                                        
                                    </Column>

                                    <Summary>
                                        <TotalItem
                                            column="stokKodu"
                                            displayFormat="{0}"
                                            summaryType="count" />
                                        <TotalItem
                                            column="tutar"
                                            summaryType="sum"
                                            valueFormat="#,##0.##"
                                            displayFormat="{0}" />
                                    </Summary>
                                    <DxToolbar>
                                        <DxToolbarItem >
                                            <ExportExcel
                                                fileName={"Stok Kalemleri"}
                                                data={formData.faturaDetays}
                                                columns={excelColumns}
                                                buttonRender={(<Button className="send"
                                                    icon="download" />)}
                                            />
                                        </DxToolbarItem>

                                        <DxToolbarItem >
                                            <Button icon='product' onClick={(e) => setStokEditModalOpen(true)}></Button>
                                        </DxToolbarItem>



                                        <DxToolbarItem name="addRowButton" />

                                    </DxToolbar>
                                </DataGrid>

                            ) : null}
                            {/* <ImportExcel textVisible={true} setResult={setExcelData} columns={excelColumns} /> */}

                        </div>



                    </Item>

                </Form>

            </form>





        </div>
    );
})

InvoiceEdit.propTypes = {

};

