import React, { useState, useRef } from 'react';
import { Popup, ToolbarItem } from 'devextreme-react/popup';
import TreeList, {
    Column,
    Editing,
    Paging, Scrolling,
    RequiredRule,
  } from 'devextreme-react/tree-list';
  
  import Form, {
    SimpleItem,
    GroupItem,
    Label
  } from 'devextreme-react/form';



export const AuthGroupEditModal = ({ open, onClose, dataSource, saveData }) => {
    const modal = useRef();
    const formRef = useRef();
    const subFormRef = useRef();
    const [contentHeight, setContentHeight] = useState(0);

    document.getElementsByClassName('dx-popup-wrapper');

    const handleSubmit = async (e) => {
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
            title="Yetki Grubu Ekle/Düzenle"
            onShown={(e) => setContentHeight(document.getElementById('modal-content').clientHeight)}

            showCloseButton={true}>
            <div id={"modal-content"} style={{ height: '100%' }}>
                <form ref={formRef} action="your-action" onSubmit={handleSubmit}>
                    <Form formData={dataSource} ref={subFormRef}>
                        <GroupItem colSpan={4}>
                            <SimpleItem dataField="name" label={{ text: "YetkiGrup Adı" }} ><RequiredRule></RequiredRule></SimpleItem>
                            <SimpleItem dataField="description" label={{ text: "Açıklama" }} />
                            <SimpleItem >
                                <Label text="Yetki Ağacı" />
                                <TreeList
                                    id="auth-group-edit"
                                    height={contentHeight - 220}
                                    dataSource={dataSource !==null && dataSource.authGroupDetails}
                                    rootValue={0}
                                    wordWrapEnabled={true}
                                    allowColumnResizing={true}
                                    allowColumnReordering={false}
                                    showRowLines={true}
                                    // onRowInserted = {rowInserted}
                                    // onRowUpdated={rowUpdated}
                                    // onRowRemoved = {rowRemoved}
                                    showBorders={true}
                                    columnAutoWidth={true}
                                    selection={{ mode: 'single' }}
                                    keyExpr="appModuleId"
                                    parentIdExpr="appModuleParentId"
                                // onToolbarPreparing={onToolbarPreparing}
                                >
                                    <Scrolling columnRenderingMode="virtual" />
                                    <Paging enabled={false} />

                                    <Editing
                                        allowAdding={false}
                                        allowUpdating={true}
                                        allowDeleting={false}
                                        mode="cell" />
                                    <Column allowEditing={false} dataField="appModuleName" caption="Modul /Özellik" dataType="string" ><RequiredRule /></Column>
                                    <Column dataField="isAuthorize" caption="Yetki" dataType="boolean" ></Column>

                                </TreeList>
                            </SimpleItem>
                            

                        </GroupItem>


                    </Form>
                </form>
            </div>
            <ToolbarItem
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={{icon: 'save',
                    type: 'success',
                    text: 'Kaydet',
                    onClick: (e) =>  saveData()
                }}
          />
        </Popup>

    );
}
