import {alertConstants as types} from '../constants'

export const alertInfo = (message) => ({ type: types.ALERT_INFO,payload:message })
export const alertSuccess = (message) => ({ type: types.ALERT_SUCCESS,payload:message })
export const alertWarning = (message) => ({ type: types.ALERT_WARNING,payload:message })
export const alertError = (message) => ({ type: types.ALERT_ERROR,payload:message })
export const alertClear = () => ({ type: types.ALERT_CLEAR })