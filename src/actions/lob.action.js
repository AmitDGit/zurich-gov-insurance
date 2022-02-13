import { lobConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = (requestParam) => {
  const request = () => {
    return { type: lobConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: lobConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: lobConstants.GETALL_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await lobService.getAllService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};

const getAllApprover = (requestParam) => {
  const success = (data) => {
    return { type: lobConstants.GETALLAPPROVER_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: lobConstants.GETALLAPPROVER_FAILURE, payload: error };
  };
  return async (dispatch) => {
    try {
      const response = await lobService.getAllApproverService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAlllob = () => {
  const success = (data) => {
    return { type: lobConstants.GETALLLOB_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: lobConstants.GETALLLOB_FAILURE, payload: error };
  };
  const requestParams = {
    PageIndex: 1,
    PageSize: 50,
  };

  return async (dispatch) => {
    try {
      const response = await lobService.getAlllobService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lobService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lobService.checkNameExistService(requestParam);
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lobService.checkIsInUseService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lobService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lobService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const lobActions = {
  getAll,
  getAlllob,
  getAllApprover,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lob/getallloblist`, param);
  return response;
};
const getAlllobService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lob/getalllob`, param);
  return response;
};
const getAllApproverService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`user/getalladuserlist`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lob/getlob`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lob/islobnameinuse`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lob/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(`lob/addeditlob`, requestParam);
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`lob/deletelob`, param);
  return response;
};
const lobService = {
  getAllService,
  getAlllobService,
  getAllApproverService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
};
