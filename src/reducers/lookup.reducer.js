import { lookupConstants } from "../constants";
const initialState = {
  loading: false,
  logtyps: [],
  breachlogitems: [],
  rfelogitems: [],
  exemptionlogitems: [],
  error: "",
};
export const lookupReducer = (state = initialState, action) => {
  switch (action.type) {
    case lookupConstants.GETLOGTYPE_REQUEST:
      return {
        ...state,
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
    case lookupConstants.GETBREACHLOGTYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        breachlogitems: action.payload,
      };
    case lookupConstants.GETBREACHLOGTYPE_FAILURE:
      return {
        ...state,
        breachlogitems: [],
        loading: false,
        error: action.payload,
      };
    case lookupConstants.GETRFELOGTYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        rfelogitems: action.payload,
      };
    case lookupConstants.GETRFELOGTYPE_FAILURE:
      return {
        ...state,
        rfelogitems: [],
        loading: false,
        error: action.payload,
      };
    case lookupConstants.GETEXEMPTIONLOGTYPE_SUCCESS:
      return {
        ...state,
        loading: false,
        exemptionlogitems: action.payload,
      };
    case lookupConstants.GETEXEMPTIONLOGTYPE_FAILURE:
      return {
        ...state,
        exemptionlogitems: [],
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
