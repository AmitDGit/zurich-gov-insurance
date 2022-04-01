import { znaorgnization3Constants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  org3Items: [],
  error: "",
};
export const znaorgnization3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case znaorgnization3Constants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case znaorgnization3Constants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case znaorgnization3Constants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case znaorgnization3Constants.GETALLORGNIZATION_SUCCESS:
      return {
        ...state,
        org3Items: action.payload,
      };
    case znaorgnization3Constants.GETALLORGNIZATION_FAILURE:
      return {
        ...state,
        org3Items: [],
      };
    default:
      return state;
  }
};
