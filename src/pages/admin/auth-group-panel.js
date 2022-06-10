import React from 'react';
import { useAdmin } from '../../contexts/hooks';
import DataGrid, {
    Column
} from 'devextreme-react/data-grid';
import { AuthGroupEditModal } from './auth-group-edit-modal'

import 'devextreme-react/text-area';

export const AuthGroupPanel = () => {

    const admin = useAdmin();


    const [authGroupDatasource, setAuthGroupDatasource] = React.useState([]);
    const [editModalOpen, setEditModalOpen] = React.useState(false);
    const [editAuthGroupData, setEditAuthGroupData] = React.useState(null);

    const fetchData = async () => {

        var _resultDataAuthGroups = await admin.getAuthGroupList();
        setAuthGroupDatasource(_resultDataAuthGroups.data);
        console.log("--- ", _resultDataAuthGroups)
    }
   
    React.useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    //const authGroupDatasource = [{id:1,name:"Admin"},{id:2,name:"Finance"},{id:3,name:"Muhasebe"}]

    
    const handleClickAddAuth = async (e) => {
        var _resultData = await admin.getAuthGroup(0);
        setEditAuthGroupData(_resultData.data)
        setEditModalOpen(true);
    }
    
    const handleClickEditGroup = async (data) => {
        var _resultData = await admin.getAuthGroup(data.id);
        setEditAuthGroupData(_resultData.data)
        setEditModalOpen(true);
    }


    const saveAuthGroup = async (e) => {
        var _resultData = await admin.editAuthGroup(editAuthGroupData);
        if(_resultData.success === true){
            setEditModalOpen(false);
            setEditAuthGroupData(null);
            fetchData();
        }
            
    }
    

    const onToolbarPreparing = (e) => {
        e.toolbarOptions.items.unshift({
            location: 'before',
            widget: 'dxButton',
            options: {
                icon: 'add',
                text: 'Yeni Grup Ekle',
                onClick:(e)=>handleClickAddAuth(e)
            }
        });
    }


    return (
        <React.Fragment>
            <AuthGroupEditModal open={editModalOpen} onClose={(e) => setEditModalOpen(false)} dataSource={editAuthGroupData} saveData={saveAuthGroup}/>
            <h3 className={'content-block'}>Kullanıcı Paneli</h3>
            <div className={'content-block dx-card responsive-paddings'} >
                <DataGrid
                    dataSource={authGroupDatasource}
                    keyExpr="id"
                    onToolbarPreparing={onToolbarPreparing}
                    height={"100%"}
                    columnHidingEnabled={true}
                    showBorders={true}
                >
                   

                    <Column dataField="id" caption="ID" width={60} hidingPriority={1}  />
                    <Column dataField="name" caption="Grup Adı" hidingPriority={2}  />
                    <Column dataField="description" caption="Açıklama" hidingPriority={0}  />
                    <Column  width={50} caption="" hidingPriority={3} cellRender={(e)=>(<ColButton handleClick={event=>handleClickEditGroup(e.data)}/>)}/>

                </DataGrid>
            </div>
        </React.Fragment>
    )
};

const ColButton = ({handleClick}) =>{

    return <a
    onClick={handleClick} class="dx-link dx-link-edit dx-icon-edit dx-link-icon" 
    title=" Edit " aria-label=" Edit "></a>
}


