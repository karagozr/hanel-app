import React, {  useRef } from 'react';
import { Popup, ToolbarItem } from 'devextreme-react/popup';

import Form, {
    SimpleItem,
    RequiredRule,
    GroupItem
} from 'devextreme-react/form';

import ScrollView from 'devextreme-react/scroll-view';

export const UserEditModal = ({ open, onClose, dataSource, saveData, authGroupsData }) => {
    const modal = useRef();
    const formRef = useRef();
    const subFormRef = useRef();
    //const [contentHeight, setContentHeight] = useState(0);

    document.getElementsByClassName('dx-popup-wrapper');


    const handleSubmit = (e) => {
       
        saveData(e);
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
            title="Kullanıcı Ekle/Düzenle"
            //onShown={(e) => setContentHeight(document.getElementById('modal-content').clientHeight)}

            showCloseButton={true}>
            <ScrollView width='100%' height='100%'>
                <div id={"modal-content"} style={{ height: '100%' }}>
                    <form action="your-action" ref={formRef} onSubmit={handleSubmit} >
                        <Form ref={subFormRef} formData={dataSource} >
                            <SimpleItem dataField="enable" label={{ text: "Aktif", location: "left" }} colSpan={1} editorType="dxSwitch" ></SimpleItem>
                            <GroupItem caption="Kişisel Bilgiler" colCount={2}>
                                <SimpleItem dataField="name" label={{ text: "Ad" }} colSpan={1}><RequiredRule></RequiredRule></SimpleItem>
                                <SimpleItem dataField="lastname" label={{ text: "Soyad" }} colSpan={1}><RequiredRule></RequiredRule></SimpleItem>
                                <SimpleItem dataField="description" label={{ text: "Açıklama" }} colSpan={2} />
                            </GroupItem>
                            <GroupItem caption="Kullanıcı Bilgileri" colCount={4}>
                                <SimpleItem dataField="userName" label={{ text: "Kullanıcı Adı" }} colSpan={2}><RequiredRule></RequiredRule></SimpleItem>
                                <SimpleItem dataField="password" label={{ text: "Parola" }} colSpan={2}><RequiredRule></RequiredRule></SimpleItem>
                                <SimpleItem dataField="authorizeGroups" editorType="dxTagBox" colSpan={4} label={{ text: "Yetki Grupları" }} editorOptions={{
                                    items: authGroupsData,
                                    displayExpr: "name",
                                    valueExpr: "id"

                                }} />
                                <SimpleItem dataField="eMail" label={{ text: "Email" }} colSpan={2}></SimpleItem>
                            </GroupItem>
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
                    onClick: (e) =>  handleSubmit(e)
                }}
          />
        </Popup>

    );
}
