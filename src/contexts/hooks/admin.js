import {useApi} from '../AppContext'

const BASE_URL='/v2/Admin';
const BASE_USER_URL='/user'
const BASE_AUTH_GROUP_URL='/authgroup'

const USER_LIST_FOR_EDIT=BASE_URL+BASE_USER_URL+'/ListForEdit';
const USER_EDIT=BASE_URL+BASE_USER_URL+'/Edit';
const USER_GET=BASE_URL+BASE_USER_URL+'/GetForEdit';
const USER_RESET_PASSWORD=BASE_URL+BASE_USER_URL+'/ResetPassword';

const AUTHGROUP_LIST=BASE_URL+BASE_AUTH_GROUP_URL+'/List';
const AUTHGROUP_GET=BASE_URL+BASE_AUTH_GROUP_URL+'/Get';
const AUTHGROUP_EDIT=BASE_URL+BASE_AUTH_GROUP_URL+'/Edit';

const APP_MODULES_URL=BASE_URL+BASE_AUTH_GROUP_URL+'/AppModules';

export const useAdmin = (props) => {
    const api =useApi();

    const getUserListForEdit = async () => {
        return await api.get(USER_LIST_FOR_EDIT,null);
    }

    const getUserForEdit = async (id) => {
        return await api.get(USER_GET,{id:id});
    }

    const resetPassword = async (data) => {
        return await api.post(USER_RESET_PASSWORD,data);
    }
    
    const editUser = async (data) => {
        return await api.post(USER_EDIT,data);
    }

    const getAuthGroupList = async () => {
        return await api.get(AUTHGROUP_LIST);
    }

    const getAuthGroup = async (id) => {
        return await api.get(AUTHGROUP_GET,{id:id});
    }

    const editAuthGroup = async (data) => {
        return await api.post(AUTHGROUP_EDIT,data);
    }

    

    return{
        getUserListForEdit,
        getUserForEdit,
        editUser,
        resetPassword,
        getAuthGroupList,
        getAuthGroup,
        editAuthGroup
    };
} 