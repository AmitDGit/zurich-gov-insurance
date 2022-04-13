import { lookupConstants } from "../constants";
const initialState = {
  loading: false,
  logtyps: [],
  lookupitems: [],
  error: "",
};
export const lookupReducer = (state = initialState, action) => {
  switch (action.type) {
    case lookupConstants.GETLOGTYPE_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case lookupConstants.GETLOGTYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        logtyps: action.payload,
      };
    case lookupConstants.GETLOGTYPE_FAILURE:
      return {
        ...state,
        loading: false,
        logtyps: [],
        error: action.payload,
      };
    case lookupConstants.GETLOOKUPITEMS_REQUEST:
      return {
        ...state,
        loading: true,
        lookupitems: [],
      };
    case lookupConstants.GETLOOKUPITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        lookupitems: action.payload,
      };
    case lookupConstants.GETLOOKUPITEMS_FAILURE:
      return {
        ...state,
        lookupitems: [],
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
