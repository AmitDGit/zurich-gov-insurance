import { znaorgnization1Constants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  org1Items: [],
  error: "",
};
export const znaorgnization1Reducer = (state = initialState, action) => {
  switch (action.type) {
    case znaorgnization1Constants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case znaorgnization1Constants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case znaorgnization1Constants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case znaorgnization1Constants.GETALLORGNIZATION_SUCCESS:
      return {
        ...state,
        org1Items: action.payload,
      };
    case znaorgnization1Constants.GETALLORGNIZATION_FAILURE:
      return {
        ...state,
        org1Items: [],
      };
    default:
      return state;
  }
};
