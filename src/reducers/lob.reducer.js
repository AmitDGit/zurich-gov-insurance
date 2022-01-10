import { lobConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  countryItems: [],
  approverUsers: [],
  apporverLoading: false,
  error: "",
};
export const lobReducer = (state = initialState, action) => {
  switch (action.type) {
    case lobConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case lobConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case lobConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case lobConstants.GETALLCOUNTRY_SUCCESS:
      return {
        ...state,
        countryItems: action.payload,
      };
    case lobConstants.GETALLCOUNTRY_FAILURE:
      return {
        ...state,
        countryItems: [],
      };
    case lobConstants.GETALLAPPROVER_REQUEST:
      return {
        ...state,
        apporverLoading: true,
      };
    case lobConstants.GETALLAPPROVER_SUCCESS:
      return {
        ...state,
        apporverLoading: false,
        approverUsers: action.payload,
      };
    case lobConstants.GETALLAPPROVER_FAILURE:
      return {
        ...state,
        approverUsers: [],
      };
    default:
      return state;
  }
};
