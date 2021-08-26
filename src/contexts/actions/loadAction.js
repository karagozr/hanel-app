import {loadConstants as types} from '../constants'

export const openLoad = (open) => (open?{ type: types.OPEN_LOAD }:{ type: types.CLOSE_LOAD })
export const openMultiLoad = (open) => (open?{ type: types.OPEN_MULTI_LOAD }:{ type: types.CLOSE_MULTI_LOAD })