import { regionConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
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
    default:
      return state;
  }
};
