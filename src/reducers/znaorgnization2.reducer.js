import { znaorgnization2Constants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  org2Items: [],
  error: "",
};
export const znaorgnization2Reducer = (state = initialState, action) => {
  switch (action.type) {
    case znaorgnization2Constants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case znaorgnization2Constants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case znaorgnization2Constants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case znaorgnization2Constants.GETALLORGNIZATION_SUCCESS:
      return {
        ...state,
        org2Items: action.payload,
      };
    case znaorgnization2Constants.GETALLORGNIZATION_FAILURE:
      return {
        ...state,
        org2Items: [],
      };
    default:
      return state;
  }
};
