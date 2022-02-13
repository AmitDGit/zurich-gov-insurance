import { countryConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  countryItems: [],
  error: "",
};
export const countryReducer = (state = initialState, action) => {
  switch (action.type) {
    case countryConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case countryConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case countryConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case countryConstants.GETALLCOUNTRY_SUCCESS:
      return {
        ...state,
        countryItems: action.payload,
      };
    case countryConstants.GETALLCOUNTRY_FAILURE:
      return {
        ...state,
        countryItems: [],
      };
    default:
      return state;
  }
};
