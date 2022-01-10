import { sublobConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  lobItems: [],
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
    case sublobConstants.GETALLLOB_SUCCESS:
      return {
        ...state,
        lobItems: action.payload,
      };
    case sublobConstants.GETALLLOB_FAILURE:
      return {
        ...state,
        lobItems: [],
      };
    default:
      return state;
  }
};
