import { userprofileConstants } from "../constants";
import Axios from "../services/Axios";

const setOktaUserProfile = (profile) => {
  return {
    type: userprofileConstants.SET_OKTAPROFILE_SUCCSS,
    payload: profile,
  };
};
const setOktaToken = (token) => {
  return {
    type: userprofileConstants.SET_TOKEN_SUCCSS,
    payload: token,
  };
};
const setOktaAuthenticated = () => {
  return {
    type: userprofileConstants.SET_OKTAAUTHENTICATED,
  };
};
const getAll = () => {
  const request = () => {
    return { type: userprofileConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: userprofileConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: userprofileConstants.GETALL_FAILURE, payload: error };
  };
  const requestParams = {};

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await userProfileService.getAllService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};

const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await userProfileService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

export const userprofileActions = {
  getAll,
  postItem,
  setOktaUserProfile,
  setOktaToken,
  setOktaAuthenticated,
};

const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`region/getallregionlist`, param);
  return response;
};

const postItemService = async (requestParam) => {
  const response = await Axios.post(`region/addeditregion`, requestParam);
  return response;
};

const userProfileService = {
  getAllService,
  postItemService,
};
