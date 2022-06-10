import React from 'react';
import { useAdmin,useReportCodeUserFilter, useGuide } from '../../contexts/hooks'
import 'devextreme-react/text-area';

import DataGrid, {
  Column,
  Paging,
  Lookup
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import { UserEditModal } from './user-edit-modal';
import { UserResetPasswordModal } from './user-reset-password-modal';
import { UserReportCodeFilterModal } from './user-report-code-filter-modal';

export const UserPanel = () => {

  const admin = useAdmin();
  const reportFilter = useReportCodeUserFilter();
  const guide = useGuide();

  const [dataSource, setDataSource] = React.useState([]);
  const [authGroupDatasource, setAuthGroupDatasource] = React.useState([]);
  const [resetPasswordData, setResetPasswordData] = React.useState({});

  const [projectsData, setProjectsData] = React.useState([]);
  const [reportFilterData, setReportFilterData] = React.useState([]);
  const [reportFilterFilter, setReportFilterFilter] = React.useState({});
  

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = React.useState(false);

  const [reportFilterModalOpen, setReportFilterModalOpen] = React.useState(false);

  const [editUserData, setEditUserData] = React.useState(null);

  const fetchData = async () => {

    var _resultData = await admin.getUserListForEdit();
    setDataSource(_resultData.data);
    var _resultDataAuthGroups = await admin.getAuthGroupList();
    setAuthGroupDatasource(_resultDataAuthGroups.data);

    var _resultProject = await guide.getProjeList();
    setProjectsData(_resultProject.data.filter(x => x.raporKod1 === 'GES').map(({projeKodu, projeAdi})=>({projectName : projeAdi, projectCode : projeKodu})));

  
  }

  // const fetchDetailData = async (refCode,month,title) => {
  //     var _resultData = await cash.getDetail({refCode:refCode, currencyCode:filterData.currencyCode, month:month,sectorName:filterData.sectorName});
  //     console.log('*** ',refCode,month,title)
  //     setDetailDatasource({data:_resultData.data, title:title});
  // }

  React.useEffect(() => {
    fetchData();
  }, []);


  const handleClickAdd = async (e) => {
    setEditUserData({})
    setEditModalOpen(true);
  }

  const handleClickEdit = async (data) => {
    var _resultData = await admin.getUserForEdit(data.id);
    setEditUserData(_resultData.data)
    setEditModalOpen(true);
  }

  const getReportFilterData  = async (projectCode) =>{
    var _resultData = await reportFilter.getReportCodeListForUser({...reportFilterFilter, projectCode});
    setReportFilterData(_resultData.data)
  } 

  const handleClickReportFilterEdit = async (data) => {
    setReportFilterFilter({userId:data.id})
    setReportFilterModalOpen(true);
  }

  const handleClickSaveReportFilter = async (e) => {
    console.log("filterData : ", reportFilterData)
    var _resultData = await reportFilter.editReportCodeListForUser(reportFilterData);
        if(_resultData.success === true){
            setReportFilterModalOpen(false);
            setReportFilterData([]);
        }
  }

  const handleClickResetPassword = async (data) => {
    //var _resultData = await admin.getUserForEdit(data.id);
    setResetPasswordData({
      userId: data.id,
      oldPassword: "",
      newPassword: "",
      newPasswordRewrite: ""
    });

    setResetPasswordModalOpen(true);
  }

  const saveResetPassword = async (e) => {
    var _resultData = await admin.resetPassword(resetPasswordData);
        if(_resultData.success === true){
           setResetPasswordModalOpen(false);
           setResetPasswordData(null);
        }
  }
  
  //const authGroupDatasource = [{id:1,name:"Admin"},{id:2,name:"Finance"},{id:3,name:"Muhasebe"}]

  const handleClickSave = async (e) => {
    var _resultData = await admin.editUser(editUserData);
        if(_resultData.success === true){
            setEditModalOpen(false);
            setEditUserData(null);
            fetchData();
        }
  }

  const cellTemplate = (container, options) => {
    var noBreakSpace = '\u00A0',
      text = (options.value || []).map(element => {
        return options.column.lookup.calculateCellValue(element);
      }).join(', ');
    container.textContent = text || noBreakSpace;
    container.title = text;
  }

  const onToolbarPreparing = (e) => {
    e.toolbarOptions.items.unshift({
        location: 'before',
        widget: 'dxButton',
        options: {
            icon: 'add',
            text: 'Yeni Ekle',
            onClick:(e)=>handleClickAdd(e)
        }
    });
  }
  

  return (
    <React.Fragment>
      <UserEditModal dataSource={editUserData} open={editModalOpen} onClose={(e)=>setEditModalOpen(false)} saveData={handleClickSave} authGroupsData={authGroupDatasource} />
      <UserResetPasswordModal dataSource={resetPasswordData} open={resetPasswordModalOpen} onClose={(e)=>setResetPasswordModalOpen(false)} saveData={saveResetPassword} authGroupsData={authGroupDatasource}/>
      <UserReportCodeFilterModal dataSource={reportFilterData} open={reportFilterModalOpen} onClose={(e)=>setReportFilterModalOpen(false)} saveData={handleClickSaveReportFilter} getData={getReportFilterData}  projectsData={projectsData}/>
      <h3 className={'content-block'}>Kullanıcı Paneli</h3>
      <div className={'content-block dx-card responsive-paddings'}>
        <DataGrid
          dataSource={dataSource}
          keyExpr="id"
          onSaving={handleClickSave}
          showBorders={true}
          onToolbarPreparing={onToolbarPreparing}
          columnHidingEnabled={true}
          height={"100%"}
        >
          <Paging enabled={false} />
          
          <Column dataField="enable" caption="Aktif" hidingPriority={6} />
          <Column dataField="userName" caption="Kullanıcı" hidingPriority={5}/>
          <Column dataField="name" caption="Ad" hidingPriority={4}/>
          <Column dataField="lastname" caption="Soyad" hidingPriority={3}/>
          <Column dataField="eMail" caption="Email" hidingPriority={0}/>
          <Column dataField="description" caption="Açıklama" hidingPriority={1}/>
          <Column
            dataField="authorizeGroups"
            caption="Yetki Grubu"
            allowSorting={false}
            hidingPriority={2}
            cellTemplate={cellTemplate}>
            <Lookup
              dataSource={authGroupDatasource}
              valueExpr="id"
              displayExpr="name"
            />

          </Column>
          <Column width={40}  caption="" hidingPriority={7} cellRender={(e)=><a href  onClick={(event)=>handleClickReportFilterEdit(e.data)} className="dx-link dx-link-filter dx-icon-filter dx-link-icon" title="Rapor/Bütçe Yeki" aria-label="Rapor/Bütçe Yeki"></a>}/>
          <Column width={40}  caption="" hidingPriority={7} cellRender={(e)=><a href onClick={(event)=>handleClickResetPassword(e.data)} className="dx-link dx-link-key dx-icon-key dx-link-icon" title="Parola Sıfırla" aria-label="Parola Sıfırla"></a>}/>
          <Column width={40}  caption="" hidingPriority={7} cellRender={(e)=><a href onClick={(event)=>handleClickEdit(e.data)} className="dx-link dx-link-edit dx-icon-edit dx-link-icon" title="Edit" aria-label="Edit"></a>}/>
        </DataGrid>
      </div>
    </React.Fragment>
  )
};

