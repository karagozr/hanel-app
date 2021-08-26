import {useApi} from '../AppContext'

const BASE_URL='/CashFlow';

const CASH_FLOW_LIST_URL='/GetList';



export const useCashFlow = (props) => {
    const api =useApi();

    const getList = async () => {
        return await api.get(BASE_URL+CASH_FLOW_LIST_URL,null);
    }

    return{
        getList
    };
} 