import axios from 'axios'
import { openLoad } from '../actions';
import { alertSuccess,alertWarning,alertError } from '../actions';
import { clearAuthData} from '../actions'

const BASE_URL = process.env.REACT_APP_BASE_URL+'/Api';

const getToken = () => {
    var userData = localStorage.getItem('auth');
    if(userData===null) return '';
    var user = JSON.parse(userData);
    
      
    //const {state} = useAuth();
    return user.token;
};

// export function* getUsername() {
//     const username = yield select(({ auth }) => auth.username)
//     return username !== undefined ? username : '';
// };

export const apiGet = async (requestUrl, queryData,downloadFile=false)=> {
    
    const axiosConfig = downloadFile? {
        headers: {
            'Access-Control-Allow-Private-Network': true,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials":"true",
            "Access-Control-Allow-Headers":"origin, content-type, accept, authorization",
            "Access-Control-Allow-Methods": "GET",
            "Content-Type":"application/json; charset=utf-8",
            "Authorization": `Bearer ${getToken()}`
        },
        responseType: 'blob'
    } : {
        headers: {
            'Access-Control-Allow-Private-Network': true,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials":"true",
            "Access-Control-Allow-Headers":"origin, content-type, accept, authorization",
            "Access-Control-Allow-Methods": "GET",
            "Content-Type":"application/json; charset=utf-8",
            "Authorization": `Bearer ${getToken()}`
        }
    } ;

    try {
        
        const { data, status } = await axios.get(`${BASE_URL}${requestUrl}`, { ...axiosConfig, params: queryData });
      
        switch (status) {
            case 200:
                return { data: data, message: 'Success', success: true ,status}
            case 201:
                return { data: data, message: 'Success', success: true ,status}
            case 204:
                return { data: data, message: 'Login Error', success: false ,status}
            default:
                return { data: data, message: 'Api Error', success: false ,status}
        }
    } catch (error) {
        const status = error.response?error.response.status:null        
        switch (status) {
            case 400:
                return { data: null, message: `${status} - Bad Request. Message : ${error.response?.data}`, success: false }
            case 401:
                return { data: null, message: `${status} - Unauthorized`, success: false ,status}
            case 403:
                return { data: null, message: `${status} - Forbidden`, success: false ,status}
            case 404:
                return { data: null, message: `${status} - Page Not Found`, success: false ,status}
            case 408:
                return { data: null, message: `${status} - Timeout Error`, success: false ,status}
            case 409:
                return { data: null, message: `${status} - Record already exist`, success: false ,status}
            default:
                return { data: null, message: 'Network Error', success: false ,status}
        }
    }
};

export const get = async (dispatch,requestUrl, queryData,downloadFile=false)=> {
    
    const {loadDispatch,alertDispatch,authDispatch} = dispatch;
    loadDispatch(openLoad(true));

    const axiosConfig = downloadFile? {
        headers: {
            'Access-Control-Allow-Private-Network': true,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials":"true",
            "Access-Control-Allow-Headers":"origin, content-type, accept, authorization",
            "Access-Control-Allow-Methods": "GET",
            "Content-Type":"application/json; charset=utf-8",
            "Authorization": `Bearer ${getToken()}`
        },
        responseType: 'blob'
    } : {
        headers: {
            'Access-Control-Allow-Private-Network': true,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials":"true",
            "Access-Control-Allow-Headers":"origin, content-type, accept, authorization",
            "Access-Control-Allow-Methods": "GET",
            "Content-Type":"application/json; charset=utf-8",
            "Authorization": `Bearer ${getToken()}`
        }
    } ;

    try {
        
        const { data, status } = await axios.get(`${BASE_URL}${requestUrl}`, { ...axiosConfig, params: queryData });
        loadDispatch(openLoad(false));
        switch (status) {
            case 200:
                //alertDispatch(alertSuccess('İşlem Başarılı'))
                return { data: data, message: 'Success', success: true ,status}
            case 201:
                alertDispatch(alertSuccess('Kayıt Başarılı'));
                return { data: data, message: 'Success', success: true ,status}
            case 204:
                alertDispatch(alertWarning('Login Error'));
                authDispatch(clearAuthData());
                return { data: data, message: 'Login Error', success: false ,status}
            default:
                alertDispatch(alertError('Api Error'));
                return { data: data, message: 'Api Error', success: false ,status}
        }
    } catch (error) {
        loadDispatch(openLoad(false));
        const status = error.response?error.response.status:null        
        switch (status) {
            case 400:
                alertDispatch(alertError(`${status} - Bad Request. Message : ${error.response?.data}`))
                return { data: null, message: `${status} - Bad Request. Message : ${error.response?.data}`, success: false }
            case 401:
                alertDispatch(alertError(`${status} - Unauthorized`));
                return { data: null, message: `${status} - Unauthorized`, success: false ,status}
            case 403:
                alertDispatch(alertError(`${status} - Forbidden`))
                return { data: null, message: `${status} - Forbidden`, success: false ,status}
            case 404:
                alertDispatch(alertError(`${status} - Page Not Found`))
                return { data: null, message: `${status} - Page Not Found`, success: false ,status}
            case 408:
                alertDispatch(alertError(`${status} - Timeout Error`))
                return { data: null, message: `${status} - Timeout Error`, success: false ,status}
            case 409:
                alertDispatch(alertError(`${status} - Record already exist`))
                return { data: null, message: `${status} - Record already exist`, success: false ,status}
            default:
                alertDispatch(alertError('Network Error'))
                return { data: null, message: 'Network Error', success: false ,status}
        }
    }
};

export const post = async (dispatch,requestUrl, postData) => {
    const {loadDispatch,alertDispatch,authDispatch} = dispatch;
    loadDispatch(openLoad(true));

    
    const axiosConfig = {
        headers: {
            'Access-Control-Allow-Private-Network': true,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials":true,
            "Access-Control-Allow-Headers":"origin, content-type, accept, authorization",
            "Content-Type":"application/json; charset=utf-8",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
            "Authorization": `Bearer ${getToken()}`
        }
    };

    try {
        
        // const ss =await axios.post(`http://localhost:17456/api/v1/WeatherForecast2/`,{kod:45654},axiosConfig);
        console.log("POST ss : ", `${BASE_URL}${requestUrl}`);
        const result = await axios.post(`${BASE_URL}${requestUrl}`, postData, axiosConfig);
        console.log("POST : ", result);
        const { data, status }=result;
        loadDispatch(openLoad(false));
        switch (status) {
            case 200:
                return { data: data, message: 'Success', success: true ,status}
            case 201:
                alertDispatch(alertSuccess('Kayıt Başarılı'));
                return { data: data, message: 'Success', success: true ,status}
            case 204:
                alertDispatch(alertWarning('Login Error'));
                authDispatch(clearAuthData());
                return { data: data, message: 'Login Error', success: false ,status}
            default:
                alertDispatch(alertError('Api Error'));
                return { data: data, message: 'Api Error', success: false ,status}
        }
        
    } catch (error) {
        console.log("POST error : ", error);
        loadDispatch(openLoad(false));
        const status = error.response?error.response.status:null    
        
        switch (status) {
            case 400:
                alertDispatch(alertError(`${status} - Bad Request. Message : ${error.response?.data}`))
                return { data: null, message: `${status} - Bad Request. Message : ${error.response?.data}`, success: false }
            case 401:
                alertDispatch(alertError(`${status} - Unauthorized`));
                return { data: null, message: `${status} - Unauthorized`, success: false ,status}
            case 403:
                alertDispatch(alertError(`${status} - Forbidden`))
                return { data: null, message: `${status} - Forbidden`, success: false ,status}
            case 404:
                alertDispatch(alertError(`${status} - Page Not Found`))
                return { data: null, message: `${status} - Page Not Found`, success: false ,status}
            case 408:
                alertDispatch(alertError(`${status} - Timeout Error`))
                return { data: null, message: `${status} - Timeout Error`, success: false ,status}
            case 409:
                alertDispatch(alertError(`${status} - Record already exist`))
                return { data: null, message: `${status} - Record already exist`, success: false ,status}
            default:
                alertDispatch(alertError('Network Error'))
                return { data: null, message: 'Network Error', success: false ,status}
        }
    }
}

export const patch = async (dispatch,requestUrl, postData) => {console.log('Patch Start  : ') ;
    const {loadDispatch,alertDispatch,authDispatch} = dispatch;
    loadDispatch(openLoad(true));
    const token = getToken();
    const axiosConfig = {
        headers: {
            'Access-Control-Allow-Private-Network': true,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials":"true",
            "Access-Control-Allow-Headers":"origin, content-type, accept, authorization",
            "Content-Type":"application/json; charset=utf-8",
            "Access-Control-Allow-Methods": "PATCH",
            "Authorization": `Bearer ${getToken()}`
        }
    };

    try {
        
        
        const { data, status }  = await axios.patch(`${BASE_URL}${requestUrl}`, postData, axiosConfig);
        loadDispatch(openLoad(false));
        switch (status) {
            case 200:
                return { data: data, message: 'Success', success: true ,status}
            case 201:
                alertDispatch(alertSuccess('Kayıt Başarılı'));
                return { data: data, message: 'Success', success: true ,status}
            case 204:
                alertDispatch(alertWarning('Login Error'));
                authDispatch(clearAuthData());
                return { data: data, message: 'Login Error', success: false ,status}
            default:
                alertDispatch(alertError('Api Error'));
                return { data: data, message: 'Api Error', success: false ,status}
        }
        
    } catch (error) {
        loadDispatch(openLoad(false));
        const status = error.response?error.response.status:null    
        
        switch (status) {
            case 400:
                alertDispatch(alertError(`${status} - Bad Request. Message : ${error.response?.data}`))
                return { data: null, message: `${status} - Bad Request. Message : ${error.response?.data}`, success: false }
            case 401:
                alertDispatch(alertError(`${status} - Unauthorized`));
                return { data: null, message: `${status} - Unauthorized`, success: false ,status}
            case 403:
                alertDispatch(alertError(`${status} - Forbidden`))
                return { data: null, message: `${status} - Forbidden`, success: false ,status}
            case 404:
                alertDispatch(alertError(`${status} - Page Not Found`))
                return { data: null, message: `${status} - Page Not Found`, success: false ,status}
            case 408:
                alertDispatch(alertError(`${status} - Timeout Error`))
                return { data: null, message: `${status} - Timeout Error`, success: false ,status}
            case 409:
                alertDispatch(alertError(`${status} - Record already exist`))
                return { data: null, message: `${status} - Record already exist`, success: false ,status}
            default:
                alertDispatch(alertError('Network Error'))
                return { data: null, message: 'Network Error', success: false ,status}
        }
    }
}