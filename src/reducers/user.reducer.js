import { userConstants } from "../constants";

const initialState = {
  loading: true,
  items: [],
  userItems: [],
  regionItems: [],
  countryItems: [],
  userRoles: [],
  error: "",
};
export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case userConstants.GETALL_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };
    case userConstants.GETALL_FAILURE:
      return {
        ...state,
        items: [],
        loading: false,
        error: action.payload,
      };
    case userConstants.GETALLUSER_SUCCESS:
      return {
        ...state,
        userItems: action.payload,
      };
    case userConstants.GETALLUSER_FAILURE:
      return {
        ...state,
        userItems: [],
      };
    case userConstants.GETALLREGION_SUCCESS:
      return {
        ...state,
        regionItems: action.payload,
      };
    case userConstants.GETALLREGION_FAILURE:
      return {
        ...state,
        regionItems: [],
      };
    case userConstants.GETALLCOUNTRY_SUCCESS:
      return {
        ...state,
        countryItems: action.payload,
      };
    case userConstants.GETALLCOUNTRY_FAILURE:
      return {
        ...state,
        countryItems: [],
      };
    case userConstants.GETALLUSERROLE_SUCCESS:
      return {
        ...state,
        userRoles: action.payload,
      };
    case userConstants.GETALLUSERROLE_FAILURE:
      return {
        ...state,
        userRoles: [],
      };
    default:
      return state;
  }
};
