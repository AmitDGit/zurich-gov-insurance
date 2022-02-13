import { regionConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  regionItems: [],
  error: "",
};
export const regionReducer = (state = initialState, action) => {
  switch (action.type) {
    case regionConstants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        error: "",
        loading: true,
      };
    case regionConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case regionConstants.GETALL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case regionConstants.POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case regionConstants.GETALLREGION_SUCCESS:
      return {
        ...state,
        regionItems: action.payload,
      };
    case regionConstants.GETALLREGION_FAILURE:
      return {
        ...state,
        regionItems: [],
      };
    default:
      return state;
  }
};
