const localstorageId = "user";
const getLocalRefreshToken = () => {
  const user = JSON.parse(localStorage.getItem(localstorageId));
  return user ? user.refreshToken : "";
};

const getLocalAccessToken = () => {
  const user = JSON.parse(localStorage.getItem(localstorageId));
  return user ? user.token : "";
};

const updateLocalAccessToken = (token) => {
  let user = JSON.parse(localStorage.getItem(localstorageId));
  user.token = token;
  localStorage.setItem(localstorageId, JSON.stringify(user));
};

const getUser = () => {
  return JSON.parse(localStorage.getItem(localstorageId));
};

const setUser = (user) => {
  console.log(JSON.stringify(user));
  localStorage.setItem(localstorageId, JSON.stringify(user));
};

const removeUser = () => {
  localStorage.removeItem(localstorageId);
};

const TokenService = {
  getLocalRefreshToken,
  getLocalAccessToken,
  updateLocalAccessToken,
  getUser,
  setUser,
  removeUser,
};

export default TokenService;
