import {useApi} from '../AppContext'

const BASE_URL='/v1/finance';

const GET_REPORT_EDIT_LIST='/GetReportCodeUserFilterList';

const EDIT_REPORT_LIST='/EditReportCodeUserFilterList';


export const useReportCodeUserFilter = (props) => {
    const api = useApi();

    const getReportCodeListForUser = async (filter) => {
        return await api.get(BASE_URL+GET_REPORT_EDIT_LIST,filter);
    }

    const editReportCodeListForUser = async (data) => {
        return await api.post(BASE_URL+EDIT_REPORT_LIST,data);
    }

    return{
        getReportCodeListForUser,
        editReportCodeListForUser
    };
} 