import {useApi} from '../AppContext'

const BASE_URL='/v1/Finance/cashflow';

const CASH_FLOW_LIST_URL='/GetList';
const CASH_FLOW_DETAIL_URL='/GetDetail';



export const useCashFlow = (props) => {
    const api =useApi();

    const getList = async (filter) => {
        return await api.get(BASE_URL+CASH_FLOW_LIST_URL,filter);
    }

    const getDetail = async (filter) => {
        return await api.get(BASE_URL+CASH_FLOW_DETAIL_URL,filter);
    }

    return{
        getList,
        getDetail
    };
} 