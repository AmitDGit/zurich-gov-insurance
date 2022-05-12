import { userprofileConstants } from "../constants";
const initialState = {
  loading: true,
  oktaProfile: "",
  userProfile: "",
  token: "",
  isAuthenticated: false,
  error: "",
};
export const userprofileReducer = (state = initialState, action) => {
  switch (action.type) {
    case userprofileConstants.SET_OKTAPROFILE_SUCCSS:
      return {
        ...state,
        oktaProfile: action.payload,
        userProfile: {
          ...action.payload,
          isAdminGroup: true,
          isSuperAdmin: true,
          userId: "1",
        },
        loading: false,
      };
    case userprofileConstants.SET_TOKEN_SUCCSS:
      return {
        ...state,
        loading: false,
        token: action.payload,
      };
    case userprofileConstants.SET_OKTAAUTHENTICATED:
      return {
        ...state,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};
