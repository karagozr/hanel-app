import {useApi} from '../AppContext'

const BASE_URL='/v2/finance/report/​';

const GET_PL='getpl';

const GET_PL_WITH_DETAIL_URL='/getplwithdetail';

const GET_PL_DETAIL_URL='/getpldetail';


export const usePlReport = () => {
    const api =useApi();

    const getPlReport = async (filter) => {
        return await api.post('/v2/finance/report/​getpl',filter);
    }

    const getPlDetail = async (filter) => {
        return await api.post(BASE_URL+GET_PL_DETAIL_URL,filter);
    }

    return{
        getPlReport,
        getPlDetail
    };
} 