import {actionButtonConstants as types} from '../constants'

export const addActionButton = (buttons) => ({ type: types.ADD_BUTTON,payload:buttons })
export const enableActionButton = (buttons) => ({ type: types.ENABLE_BUTTON,payload:buttons })
export const disableActionButton = () => ({ type: types.DISABLE_BUTTON,payload:null })
export const changePositionActionButton = () => ({ type: types.CHANGE_POSITION,payload:null })