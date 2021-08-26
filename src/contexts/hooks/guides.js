import {useApi} from '../AppContext'

const BASE_URL='/netsis';

const CARI_LIST_URL='/CariList';
const HESAPKOD_LIST_URL='/HesapKoduList';
const STOK_LIST_URL='/StokList';
const MUHASEBE_REF_LIST_URL='/MuhasebeReferansList';
const SUBE_LIST_URL='/SubeList';
const COMPANY_LIST_URL='/SirketList';
const PROJE_LIST_URL='/ProjeList';



export const useGuide = (props) => {
    const api =useApi();

    const getCariList = async () => {
        return await api.get(BASE_URL+CARI_LIST_URL,null);
    }
    const getHesapKodList = async () => {
        return await api.get(BASE_URL+HESAPKOD_LIST_URL,null);
    }
    const getStokList = async () => {
        return await api.get(BASE_URL+STOK_LIST_URL,null);
    }
    const getMuhasebeRefList = async () => {
        return await api.get(BASE_URL+MUHASEBE_REF_LIST_URL,null);
    }
    const getSubeList = async (_vkn) => {
        return await api.get(BASE_URL+SUBE_LIST_URL,{vkn:_vkn});
    }
    const getCompanyList = async (_vkn) => {
        return await api.get(BASE_URL+COMPANY_LIST_URL,{vkn:_vkn});
    }
    const getProjeList = async () => {
        return await api.get(BASE_URL+PROJE_LIST_URL,null);
    }

    return{
        getCariList,
        getHesapKodList,
        getStokList,
        getMuhasebeRefList,
        getSubeList,
        getCompanyList,
        getProjeList
    };
} 