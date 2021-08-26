import { loadConstants as types } from "../constants";

export const loadReducer = (state, action)=> {
  
    switch (action.type) {
      case types.OPEN_MULTI_LOAD: {
        return {open:true,isMulti:true}
      }
      case types.CLOSE_MULTI_LOAD: {
        return {open:false,isMulti:false}
      }
      case types.OPEN_LOAD: {
        if(state.isMulti)
          return state

        else return {open:true,isMulti:false}
      }
      case types.CLOSE_LOAD: {
        if(state.isMulti)
          return state

        else return {open:false,isMulti:false}
      }

      default: {
        throw new Error(`Unhandled action type: ${action.type}`)
      }
    }
  }