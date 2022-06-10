import {useApi} from '../AppContext'

const BASE_URL='/v1/Construction';

const ACTIVITY_REPORT_URL='/activity/GetReport';
const ACTIVITY_REPORT_DETAIL_URL='/activity/GetReportDetail';



export const useConstructionActivity = () => {
    const api =useApi();

    const getReport = async (filter) => {
        return await api.get(BASE_URL+ACTIVITY_REPORT_URL,filter);
    }

    const getDetail = async (filter) => {
        return await api.get(BASE_URL+ACTIVITY_REPORT_DETAIL_URL,filter);
    }

    return{
        getReport,
        getDetail
    };
}