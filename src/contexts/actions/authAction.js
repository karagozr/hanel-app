import {authConstants as types} from '../constants'

export const setAuthData = (data) => {
    
    return { type: types.SET_AUTH ,payload: data}
}

export const clearAuthData = () => {

    return { type: types.CLEAR_AUTH ,payload: null}
}