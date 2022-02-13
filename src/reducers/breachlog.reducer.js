import { breachlogConstants } from "../constants";

const initialState = {
  loading: true,
  items: [],
  status: [],
  error: "",
};
export const breachlogReducer = (state = initialState, action) => {
  switch (action.type) {
    case breachlogConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case breachlogConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case breachlogConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case breachlogConstants.GETSTATUS_SUCCESS:
      return {
        ...state,
        status: action.payload,
      };
    case breachlogConstants.GETSTATUS_FAILURE:
      return {
        ...state,
        status: [],
      };

    default:
      return state;
  }
};
