import React, { useState, useRef } from 'react';
import { Popup, ToolbarItem } from 'devextreme-react/popup';

import Form, {
    SimpleItem,
    RequiredRule,CompareRule
} from 'devextreme-react/form';

import ScrollView from 'devextreme-react/scroll-view';

export const UserResetPasswordModal = ({ open, onClose, dataSource, saveData }) => {
    const modal = useRef();
    const formRef = useRef();
    const subFormRef = useRef();
    const [contentHeight, setContentHeight] = useState(0);

    document.getElementsByClassName('dx-popup-wrapper');


    const handleSubmit = (e) => {   
        saveData(e);
    }
    
    
    const passwordComparison =()=> {
        return dataSource.newPassword;
    }

    return (
        <Popup
            visible={open}
            ref={modal}
            onHiding={onClose}
            dragEnabled={true}
            closeOnOutsideClick={false}
            showTitle={true}
            width={320}
            height={400}
            resizeEnabled={true}
            title="Parola Sııfrla"
            onShown={(e) => setContentHeight(document.getElementById('modal-content').clientHeight)}

            showCloseButton={true}>
            <ScrollView width='100%' height='100%'>
                <div id={"modal-content"} style={{ height: '100%' }}>
                    <form action="your-action" ref={formRef} onSubmit={handleSubmit} >
                        <Form ref={subFormRef} formData={dataSource} >
                            <SimpleItem dataField="newPassword" label={{ text: "Yeni Parola" }} colSpan={2}><RequiredRule></RequiredRule></SimpleItem>
                            <SimpleItem dataField="newPasswordRewrite" label={{ text: "Yeni Parola Terkrar" }} colSpan={2}><RequiredRule></RequiredRule>
                            <CompareRule
                                message="Parolalar eşleşmiyor !"
                                comparisonTarget={passwordComparison}
                            />
                            </SimpleItem>
                        </Form>
                    </form>
                </div>
            </ScrollView>
            <ToolbarItem
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={{icon: 'save',
                    type: 'success',
                    text: 'Kaydet',
                    useSubmitBehavior: true,
                    onClick: (e) => subFormRef.current.instance.validate().isValid && handleSubmit(e)
                }}
          />
        </Popup>

    );
}
