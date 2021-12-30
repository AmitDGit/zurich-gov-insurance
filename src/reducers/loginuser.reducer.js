import { loginuserConstants } from "../constants";
import TokenService from "../services/Tokenservice";
let user = TokenService.getUser();
const initialState = user
  ? { loggedIn: false, user }
  : { loggedIn: false, loggingIn: false };
export const loginuserReducer = (state = initialState, action) => {
  switch (action.type) {
    case loginuserConstants.LOGIN_REQUEST:
      return { ...state, loggingIn: true, user: action.payload };
    case loginuserConstants.LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loggedIn: true,
        user: action.payload,
      };
    case loginuserConstants.LOGIN_FAILURE:
      return {
        ...state,
        loggingIn: true,
        loggedIn: false,
        user: action.payload,
      };
    case loginuserConstants.LOGOUT:
      return {};
    default:
      return state;
  }
};
