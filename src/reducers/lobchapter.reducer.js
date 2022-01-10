import { lobchapterConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  lobsItems: [],
  error: "",
};
export const lobchapterReducer = (state = initialState, action) => {
  switch (action.type) {
    case lobchapterConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case lobchapterConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case lobchapterConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case lobchapterConstants.GETALLLOB_SUCCESS:
      return {
        ...state,
        lobsItems: action.payload,
      };
    case lobchapterConstants.GETALLLOB_FAILURE:
      return {
        ...state,
        lobsItems: [],
      };
    default:
      return state;
  }
};
