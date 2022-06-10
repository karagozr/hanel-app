import React, { useState, useEffect, useRef } from 'react';
import { Popup, Position, ToolbarItem } from 'devextreme-react/popup';
import { Button, SelectBox } from 'devextreme-react';
import { NumberBox } from 'devextreme-react/number-box';

import ScrollView from 'devextreme-react/scroll-view';
const defaultObj = { budgetAmount: 0.0, budgetPercentage: 0.0, actualAmount: 0.0, actualPercentage: 0.0 }
export const BudgetReportFastEditModal = ({ open, onClose, dataSource, saveData }) => {
    const modal = useRef();
    const formRef = useRef();
    const subFormRef = useRef();
    const [contentHeight, setContentHeight] = useState(0);
    const [calculateObject, setCalculateObject] = useState(defaultObj);

    document.getElementsByClassName('dx-popup-wrapper');


    const handleSubmit = (e) => {
        
        saveData(calculateObject);
    }
    console.log("ss : ",calculateObject);
    

    const handleChangeFastAdd = (value, addType) => {
        
        setCalculateObject({ [addType]: value === null ? 0 : value });
    };

    const handleChangeFastAddCurrency = React.useCallback(({value}) => {
        setCalculateObject({...calculateObject,});
    })

    return (
        <Popup
            visible={open}
            ref={modal}
            onHiding={onClose}
            dragEnabled={true}
            closeOnOutsideClick={false}
            showTitle={true}
            width={320}
            height={500}
            resizeEnabled={true}
            title="Hızlı Bütçe Kalemi Ekle"
            //onShown={(e) => setContentHeight(document.getElementById('modal-content').clientHeight)}

            showCloseButton={true}>
            <ScrollView width='100%' height='100%'>
               
                <div className="form">
                <p style={{color:'#f44336'}}> İşlem sırsında, varsa eski kayıtlar silinir ye yenisi eklenir. </p>
    
                    <div className="dx-fieldset">
                        <div className="dx-fieldset-header">Geçmiş Bütçeye Göre</div>
                        <div className="dx-field">
                            <div className="dx-field-label">Miktar +/-</div>
                            <div className="dx-field-value">
                                <NumberBox

                                    value={calculateObject["budgetAmount"]}
                                    showSpinButtons={true}
                                    showClearButton={true}
                                    onValueChanged={e => handleChangeFastAdd(e.value, "budgetAmount")}
                                />
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Oran +/-</div>
                            <div className="dx-field-value">
                                <NumberBox

                                    value={calculateObject["budgetPercentage"]}
                                    
                                    showSpinButtons={true}
                                    showClearButton={true}
                                    onValueChanged={e => handleChangeFastAdd(e.value, "budgetPercentage")}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="dx-fieldset">
                        <div className="dx-fieldset-header">Geçmiş Gerçekleşene Göre</div>
                        <div className="dx-field">
                            <div className="dx-field-label">Miktar +/-</div>
                            <div className="dx-field-value">
                                <NumberBox

                                    value={calculateObject["actualAmount"]}
                                    showSpinButtons={true}
                                    showClearButton={true}
                                    onValueChanged={e => handleChangeFastAdd(e.value, "actualAmount")}
                                />
                            </div>
                        </div>
                        <div className="dx-field">
                            <div className="dx-field-label">Oran +/-</div>
                            <div className="dx-field-value">
                                <NumberBox
                                    value={calculateObject["actualPercentage"]}
                               
                                    showSpinButtons={true}
                                    showClearButton={true}
                                    onValueChanged={e => handleChangeFastAdd(e.value, "actualPercentage")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollView>
            <ToolbarItem
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={{
                    icon: 'save',
                    type: 'success',
                    text: 'Kaydet',
                    useSubmitBehavior: true,
                    onClick: (e) => (calculateObject.budgetAmount != 0 || calculateObject.budgetPercentage != 0 || calculateObject.actualAmount != 0 || calculateObject.actualPercentage != 0) && handleSubmit(e)
                }}
            />
        </Popup>

    );
}
