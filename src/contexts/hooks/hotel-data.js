import {useApi} from '../AppContext'

const BASE_URL='/HotelReport';

const ROOM_SALE_URL='/GetRoomSaleReport';

const ROOM_SALE_SUM_URL='/GetRoomSaleSumReport';

const ROOM_SALE_SUM_WITH_AGENT_URL='/GetRoomSaleWithAgentSumReport';

export const useHotelData = () => {
    const api =useApi();

    const getHotelSalesRawData = async () => {
        return await api.get(BASE_URL+ROOM_SALE_URL,null);
    }
   
    const getRoomSaleSumData = async () => {
        return await api.get(BASE_URL+ROOM_SALE_SUM_URL,null);
    }

    const getRoomSaleSumWithAgentData = async (filter) => {
        var result = await api.get(BASE_URL+ROOM_SALE_SUM_WITH_AGENT_URL,filter);
        //result.data = Object.assign(result.data !== undefined? JSON.parse(result.Data): []);
        return result;
    }


    return{
        getHotelSalesRawData, getRoomSaleSumData,getRoomSaleSumWithAgentData
    };
} 