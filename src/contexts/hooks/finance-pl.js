import {useApi} from '../AppContext'

const BASE_URL='/v2/Finance/Reports'

const GET_PL_URL='/Getpl'

const GET_PL_DETAIL_URL='/getpldetail'


export const usePlReport = () => {
    const api =useApi();

    const getPlReport = async (filter) => {
        return await api.post(BASE_URL+GET_PL_URL,filter);
    }

    const getPlDetail = async (filter) => {
        console.log("--> ",filter)
        return await api.post(BASE_URL+GET_PL_DETAIL_URL,filter);
    }

    return{
        getPlReport,
        getPlDetail
    };
} 