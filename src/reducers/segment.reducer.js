import { segmentConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  countryItems: [],
  error: "",
};
export const segmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case segmentConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case segmentConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case segmentConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case segmentConstants.GETALLCOUNTRY_SUCCESS:
      return {
        ...state,
        countryItems: action.payload,
      };
    case segmentConstants.GETALLCOUNTRY_FAILURE:
      return {
        ...state,
        countryItems: [],
      };
    default:
      return state;
  }
};
