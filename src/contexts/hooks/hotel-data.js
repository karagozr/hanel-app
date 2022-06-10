import {useApi} from '../AppContext'

const BASE_URL='/v1/hotel/report';

const ROOM_SALE_URL='/GetRoomSaleReport';

const ROOM_SALE_SUM_URL='/GetRoomSaleSumReport';

const ROOM_SALE_SUM_WITH_AGENT_URL='/GetRoomSaleWithAgentSumReport';

const ROOM_SALE_ACM_URL='/GetRoomSaleACMReport';

const ROOM_SALE_AGENT_DAILY_URL='/GetRoomSaleAgentDaily';

const ROOM_INCOME_AGENT_DAILY_URL='/GetRoomIncomeAgentDaily';

const HOTEL_CAPACITY_URL='/GetHotelCapacity';

export const useHotelData = () => {
    const api =useApi();

    const getHotelSalesRawData = async () => {
        return await api.get(BASE_URL+ROOM_SALE_URL,null);
    }
   
    const getRoomIncomeSumData = async (year) => {
        return await api.get(BASE_URL+ROOM_SALE_SUM_URL,{year});
    }

    const getRoomSaleSumWithAgentData = async (filter) => {
        var result = await api.get(BASE_URL+ROOM_SALE_SUM_WITH_AGENT_URL,filter);
        //result.data = Object.assign(result.data !== undefined? JSON.parse(result.Data): []);
        return result;
    }

    const getRoomSaleSumWithACMData = async (filter) => {
        var result = await api.get(BASE_URL+ROOM_SALE_ACM_URL,filter);
        return result;
    }

    const getRoomIncomeAgentDailyData = async (filter) => {
        var result = await api.get(BASE_URL+ROOM_INCOME_AGENT_DAILY_URL,filter);
        return result;
    }

    const getRoomSaleAgentDailyData = async (filter) => {
        var result = await api.get(BASE_URL+ROOM_SALE_AGENT_DAILY_URL,filter);
        return result;
    }
    
    const getHotelCapacity = async (hotelName) => {
        var result = await api.get(BASE_URL+HOTEL_CAPACITY_URL,{hotelName:hotelName});
        return result;
    }

    return{
        getHotelSalesRawData, 
        getRoomIncomeSumData,
        getRoomSaleSumWithAgentData,
        getRoomSaleSumWithACMData,
        getRoomIncomeAgentDailyData,
        getRoomSaleAgentDailyData,
        getHotelCapacity
    };
} 