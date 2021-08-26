import { actionButtonConstants as types } from "../constants";

export const actionButtonReducer = (state, {type,payload})=> {
    switch (type) {
      case types.ADD_BUTTON: {
        if(state.buttons.length===0)
          return {buttons : [...state.buttons,...payload],position:state.position}
        
        var array = [];
        payload.forEach(element => {
          if(!state.buttons.find(x=>x.label===element.label)){
            array.push(element)
          }
        });
        return {buttons : [...state.buttons,...array],position:state.position}
      }
      case types.ENABLE_BUTTON: {
        return payload
      }
      case types.DISABLE_BUTTON: {
        return {buttons : [],position:state.position}
      }
      case types.CHANGE_POSITION: {
        return {buttons : state.buttons ,position:state.position==='top'?'bottom':'top'}
      }
      default: {
        return state;
      }
    }
  }