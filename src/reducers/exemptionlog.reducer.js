import { exemptionlogConstants } from "../constants";

const initialState = {
  loading: true,
  items: [],
  error: "",
};
export const exemptionlogReducer = (state = initialState, action) => {
  switch (action.type) {
    case exemptionlogConstants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case exemptionlogConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case exemptionlogConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
