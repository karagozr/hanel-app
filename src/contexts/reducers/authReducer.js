import { authConstants as types } from "../constants";

export const authReducer = (state, {type,payload})=> {
    switch (type) {
      case types.SET_AUTH: {
        return payload
      }
      case types.CLEAR_AUTH: {
        return payload
      }
      default: {
        return state;
      }
    }
  }