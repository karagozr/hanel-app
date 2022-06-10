import {useApi} from '../AppContext'

const BASE_URL='/v2/Finance/budget';


const GET_BUDGET_PROJECT_LIST_URL='/GetProjectBudgetList';
const GET_BUDGET_LIST_URL='/GetBudgetReport';
const GET_BUDGET_REPORT_FOR_PROJECT_URL='/GetProjectBudgetReport';

const ADD_BUDGET_LIST='/AddBudgetList';
const EDIT_BUDGET_LIST='/EditBudgetList';

const GET_BUDGET_DETAIL='/GetBudgetDetail';
const EDIT_BUDGET_DETAIL='/EditBudgetDetail';

const GET_BUDGET_DETAIL_OF_PROJECT='/GetBudgetDetailOfProject';

const GET_BUDGET_EXCHANGE_RATES='/GetExchangeRates';
const EDIT_BUDGET_EXCHANGE_RATES='/EditExchangeRates';




export const useBudget = (props) => {
    const api =useApi();

    const getBudgetProjectList = async (filter) => {
        return await api.get(BASE_URL+GET_BUDGET_PROJECT_LIST_URL,filter);
    }

    const getBudgetReport = async (filter) => {
        return await api.get(BASE_URL+GET_BUDGET_REPORT_FOR_PROJECT_URL,filter);
    }

    const getBudgetReportAllProject = async (filter) => {
        return await api.get(BASE_URL+GET_BUDGET_LIST_URL,filter);
    }

    

    const addBudget = async (data) => {
        return await api.post(BASE_URL+ADD_BUDGET_LIST,data);
    }

    const editBudget = async (data) => {
        return await api.post(BASE_URL+EDIT_BUDGET_LIST,data);
    }

    const getBudgetDetail = async (filter) => {
        return await api.get(BASE_URL+GET_BUDGET_DETAIL,filter);
    }

    const editBudgetDetail = async (data) => {
        return await api.post(BASE_URL+EDIT_BUDGET_DETAIL,data);
    }

    const getBudgetDetailOfProject = async (filter) => {
        return await api.get(BASE_URL+GET_BUDGET_DETAIL_OF_PROJECT,filter);
    }

    const getBudgetExchangeRates = async (filter) => {
        return await api.get(BASE_URL+GET_BUDGET_EXCHANGE_RATES,filter);
    }

    const editBudgetExchangeRates = async (data) => {
        return await api.post(BASE_URL+EDIT_BUDGET_EXCHANGE_RATES,data);
    }

    return{
        getBudgetProjectList,
        getBudgetReport,
        addBudget,
        editBudget,
        getBudgetDetail,
        editBudgetDetail,
        getBudgetDetailOfProject,
        getBudgetExchangeRates,
        editBudgetExchangeRates,
        getBudgetReportAllProject
    };
} 
