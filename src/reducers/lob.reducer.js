import { lobConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  approverUsers: [],
  lobItems: [],
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
    case lobConstants.GETALLLOB_SUCCESS:
      return {
        ...state,
        lobItems: action.payload,
      };
    case lobConstants.GETALLLOB_FAILURE:
      return {
        ...state,
        lobItems: [],
      };
    default:
      return state;
  }
};
