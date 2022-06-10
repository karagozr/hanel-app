import {useApi} from '../AppContext'

const BASE_URL='/v1/finance';

const GET_REPORT_LIST='/GetReportCodeList';

const EDIT_REPORT_LIST='/EditReportCodeList';


export const useReportCode = (props) => {
    const api =useApi();

    const getReportCode = async () => {
        return await api.get(BASE_URL+GET_REPORT_LIST,null);
    }

    const editReportCode = async (data) => {
        return await api.post(BASE_URL+EDIT_REPORT_LIST,data);
    }

    return{
        getReportCode,
        editReportCode
    };
} 