import * as React from 'react';
import { loadReducer,alertReducer,authReducer,actionButtonReducer} from './reducers'
import { setAuthData,clearAuthData} from './actions'
import {get,post,patch} from './service/api';
import jwtDecode from 'jwt-decode'

const AppContext = React.createContext();


const getUserinLocalStorge = async () =>{
  var userData = await localStorage.getItem('auth');
  var result = await JSON.parse(userData);
  return result;
}

const setUserinLocalStorge = async (userData) =>{
   await localStorage.setItem('auth',JSON.stringify(userData));
}

const clearUserinLocalStorge = async () =>{
  await localStorage.clear('auth');
}



function AppProvider({children}) {
    const [loadState, loadDispatch] = React.useReducer(loadReducer, {open: false});
    const [alertState, alertDispatch] = React.useReducer(alertReducer, {type:null,payload:null});
    const [authState, authDispatch] = React.useReducer(authReducer, {type:null,payload:null});
    const [actionButtonState, actionButtonDispatch] = React.useReducer(actionButtonReducer, {buttons:[],position:'bottom'});

    React.useEffect(()=>{},[
      
    ])

    const dispatch={loadDispatch,alertDispatch,authDispatch}
    const value ={
                load:{loadState, loadDispatch},
                alert:{alertState, alertDispatch},
                auth:{authState, authDispatch},
                actionButton:{actionButtonState, actionButtonDispatch},
                api : {
                  get:async (url,payload)=>await get(dispatch,url,payload),
                  downloadGet:async (url,payload)=>await get(dispatch,url,payload,true),
                  post:async (url,payload)=>await post(dispatch,url,payload),
                  patch:async (url,payload)=>await patch(dispatch,url,payload),
                }, 
                
              };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}


function useApp() {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error('must be used within a LoadProvider')
  }
  return context;
}

function useActionButton() {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error('must be used within a LoadProvider')
  }
  return {state:context.actionButton.actionButtonState,dispatch:context.actionButton.actionButtonDispatch};
}

function useApi() {
  const context = React.useContext(AppContext)
  if (context === undefined) {
    throw new Error('must be used within a LoadProvider')
  }
  return context.api;
}

function useAuth() {
  const context = React.useContext(AppContext);
 
  const api = useApi();
  //const auth = context;

  React.useEffect(() => {

    var fetchFunc = async ()=>{
      var authInLS = await getUserinLocalStorge();
      context.auth.authDispatch(setAuthData(authInLS));
    }
    fetchFunc();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[context.auth.authDispatch])
  
  

  const login = async (userName,password) => {
    
    var result = await api.post("/auth/login", {
                                  userName: userName,
                                  password: password
                                });
    try{
      if(result.success){
        
        var decodedToken = jwtDecode(result.data.token)
        var _userName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

        var authData= {token:result.data.token,user :_userName};
        
        await setUserinLocalStorge(authData);


        context.auth.authDispatch(setAuthData(authData));
        return true;
      }
    }catch{
      return false;
    }

  }


  const logout = async ()=>{
    await clearUserinLocalStorge();
    context.auth.authDispatch(clearAuthData())
  }

  if (context === undefined) {
    throw new Error('must be used within a LoadProvider')
  }
  return {state : context.auth.authState, dispatch:context.auth.authDispatch, login, logout};
}


function useLoad() {
    const context = React.useContext(AppContext);
    if (context === undefined) {
      throw new Error('must be used within a LoadProvider')
    }
    return {state :context.load.loadState,dispatch:context.load.loadDispatch};
}

function useAlert() {
    const context = React.useContext(AppContext)
    if (context === undefined) {
      throw new Error('must be used within a LoadProvider')
    }
    return {state :context.alert.alertState,dispatch:context.alert.alertDispatch};
}


export {AppProvider,useApp,useLoad,useAlert,useApi,useAuth,useActionButton}