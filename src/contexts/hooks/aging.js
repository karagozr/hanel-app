import {useApi} from '../AppContext';

import {apiGet} from '../service/api';

const BASE_URL='/v2/Finance/aging';

const AGING_REPORT_URL='/report';
const AGING_REPORT_DETAIL_URL='/detail';

export const AGING_REPORT_BRANCH_URL=AGING_REPORT_URL+'/branch';
export const AGING_REPORT_PROJECT_URL=AGING_REPORT_URL+'/project';


export const useAging = (props) => {
    const api =useApi();

    const getReport = async (filter) => {
        var res = await api.get(BASE_URL+AGING_REPORT_URL,filter);
        return res.data;
    }

    const getReportBranch = async (filter) => {
        return await apiGet(BASE_URL+AGING_REPORT_BRANCH_URL,filter);
    }

    const getReportProject = async (filter) => {
        return await apiGet(BASE_URL+AGING_REPORT_PROJECT_URL,filter);
    }

    const getDetail = async (filter) => {
        return await api.get(BASE_URL+AGING_REPORT_DETAIL_URL,filter);
    }

    return{
        getReport,
        getReportBranch,
        getReportProject,
        getDetail
    };
} 