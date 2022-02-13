import { sublobConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = (requestParam) => {
  const request = () => {
    return { type: sublobConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: sublobConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: sublobConstants.GETALL_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await sublobService.getAllService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};

const getAllSublob = () => {
  const success = (data) => {
    return { type: sublobConstants.GETALLSUBLOB_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: sublobConstants.GETALLSUBLOB_FAILURE, payload: error };
  };
  const requestParams = {};

  return async (dispatch) => {
    try {
      const response = await sublobService.getAllSublobService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await sublobService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await sublobService.checkNameExistService(requestParam);
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await sublobService.checkIsInUseService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await sublobService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await sublobService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const sublobActions = {
  getAll,
  getAllSublob,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`sublob/getallsubloblist`, param);
  return response;
};
const getAllSublobService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`sublob/getallsublob`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`sublob/getsublob`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`sublob/issublobnameinuse`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`sublob/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(`sublob/addeditsublob`, requestParam);
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`sublob/deletesublob`, param);
  return response;
};
const sublobService = {
  getAllService,
  getAllSublobService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
};
