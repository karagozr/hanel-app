import { alertConstants as types } from "../constants";

export const alertReducer = (state, {type,payload})=> {
    
    switch (type) {
      case types.ALERT_INFO: {
        return {type:'info',payload}
      }
      case types.ALERT_SUCCESS: {
        return {type:'success',payload}
      }
      case types.ALERT_WARNING: {
        return {type:'warning',payload}
      }
      case types.ALERT_ERROR: {
        return {type:'error',payload}
      }
      case types.ALERT_CLEAR:
        return {};
      default: {
        return state
      }
    }
  }