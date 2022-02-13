import { sublobConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  sublobitems: [],
  error: "",
};
export const sublobReducer = (state = initialState, action) => {
  switch (action.type) {
    case sublobConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case sublobConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case sublobConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case sublobConstants.GETALLSUBLOB_SUCCESS:
      return {
        ...state,
        sublobitems: action.payload,
      };
    case sublobConstants.GETALLSUBLOB_FAILURE:
      return {
        ...state,
        sublobitems: [],
        error: action.payload,
      };
    default:
      return state;
  }
};
