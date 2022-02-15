import { segmentConstants } from "../constants";
const initialState = {
  loading: true,
  items: [],
  segmentItems: [],
  error: "",
};
export const segmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case segmentConstants.GETALL_REQUEST:
      return {
        ...state,
        items: [],
        loading: true,
      };
    case segmentConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case segmentConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case segmentConstants.GETALLSEGMENT_SUCCESS:
      return {
        ...state,
        segmentItems: action.payload,
      };
    case segmentConstants.GETALLSEGMENT_FAILURE:
      return {
        ...state,
        segmentItems: [],
        error: action.payload,
      };
    default:
      return state;
  }
};
