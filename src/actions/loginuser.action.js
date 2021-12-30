import { loginuserConstants } from "../constants";
import axios from "axios";
import { apiURL } from "../services/Axios";
import TokenService from "../services/Tokenservice";
const getLoginuserDetails = () => {
  const request = () => {
    return {
      type: loginuserConstants.USERDETAIL_REQUEST,
    };
  };
  const success = (data) => {
    return {
      type: loginuserConstants.USERDETAIL_SUCCESS,
      payload: data,
    };
  };
  const failure = (error) => {
    return {
      type: loginuserConstants.USERDETAIL_FAILURE,
      payload: error,
    };
  };
  return (dispatch) => {
    dispatch(request());
  };
};
const login = (username, password) => {
  const request = (user) => {
    return { type: loginuserConstants.LOGIN_REQUEST, payload: user };
  };
  const success = (user) => {
    return { type: loginuserConstants.LOGIN_SUCCESS, payload: user };
  };
  const failure = (error) => {
    return { type: loginuserConstants.USERDETAIL_FAILURE, payload: error };
  };
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    accept: "text / plain",
  };
  const requestOptions = {
    emailAddress: username,
    password: password,
    salt: "",
  };
  return async (dispatch) => {
    dispatch(request({ username }));
    try {
      const response = await axios.post(apiURL + `user/login`, requestOptions, {
        headers: headers,
      });
      const user = response.data;
      TokenService.setUser(user);
      dispatch(success(user));
    } catch (err) {
      console.log(err);
      dispatch(failure(err));
    }
  };
};

function logout() {
  TokenService.removeUser();
  return { type: loginuserConstants.LOGOUT };
}
export const loginuserAction = {
  getLoginuserDetails,
  login,
  logout,
};
function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);

    if (!response.ok) {
      if (response.status === 401) {
        // auto logout if 401 response returned from api
        logout();
        window.location.reload(true);
      }

      const error = (data && data.error) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
}
