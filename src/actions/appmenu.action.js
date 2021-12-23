import { appmenuConstants } from "../constants";
const menuClick = (value) => {
  return {
    type: appmenuConstants.APP_MENU_CLICK,
    payload: value,
  };
};
export const appmenuActions = {
  menuClick,
};
