import { appmenuConstants } from "../constants";
const initialState = {
  isSubmenu: false,
  currentMenu: "",
};
export const appmenuReducer = (state = initialState, action) => {
  switch (action.type) {
    case appmenuConstants.APP_MENU_CLICK:
      return {
        ...state,
        isSubmenu: action.payload.isSubmenu,
        currentMenu: action.payload.currentMenu,
      };
    default:
      return state;
  }
};
