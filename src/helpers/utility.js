const localstorageId = "zchuser";
export const setAccessToken = (user) => {
  window.localStorage.setItem(localstorageId, JSON.stringify(user));
};
export const getAccessToken = () => {
  return window.localStorage.getItem(localstorageId);
};
export const removeAccessToken = () => {
  window.localStorage.removeItem(localstorageId);
};
export const setLocalValue = (DATA) => {
  let users = JSON.parse(localStorage.getItem("TNA")) || [];
  users = { ...users, DATA };
  localStorage.setItem("TNA", JSON.stringify(users));
};

export const getLocalValue = (ParamVal) => {
  let users = JSON.parse(localStorage.getItem("TNA")) || [];

  return users.DATA && users.DATA[ParamVal] ? users.DATA[ParamVal] : "";
};

export const getAPIPath = () => {
  return "http://tekserver/TnaApi/api/";
};
