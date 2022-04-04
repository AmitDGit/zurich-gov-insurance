import { lobchapterConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  lobChapterItems: [],
  error: "",
};
export const lobchapterReducer = (state = initialState, action) => {
  switch (action.type) {
    case lobchapterConstants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case lobchapterConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case lobchapterConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case lobchapterConstants.GETALLLOBCHAPTER_SUCCESS:
      return {
        ...state,
        lobChapterItems: action.payload,
      };
    case lobchapterConstants.GETALLLOBCHAPTER_FAILURE:
      return {
        ...state,
        lobChapterItems: [],
      };
    default:
      return state;
  }
};
