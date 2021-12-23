import { loginuserConstants } from "../constants";
import axios from "axios";

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
export const loginuserAction = {
  getLoginuserDetails,
};
