import { breachlogConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = (requestParam) => {
  const request = () => {
    return { type: breachlogConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: breachlogConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: breachlogConstants.GETALL_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await breachlogService.getAllService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};

const getAllStatus = (requestParam) => {
  const success = (data) => {
    return { type: breachlogConstants.GETSTATUS_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: breachlogConstants.GETSTATUS_FAILURE, payload: error };
  };
  return async (dispatch) => {
    try {
      const response = await breachlogService.getAllStatusService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};

const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await breachlogService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await breachlogService.checkIsInUseService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await breachlogService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await breachlogService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const uploadFile = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await breachlogService.uploadFileService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteFile = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await breachlogService.deleteFileService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const breachlogActions = {
  getAll,
  getAllStatus,
  getById,
  checkIsInUse,
  postItem,
  deleteItem,
  uploadFile,
  deleteFile,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`breachlog/getallbreachlogs`, param);
  return response;
};
const getAllStatusService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`systemrole/getallroles`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`breachlog/getbreachlog`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`user/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(`breachlog/addeditbreachlog`, requestParam);
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`breachlog/deletebreachlog`, param);
  return response;
};
const uploadFileService = async (requestParam) => {
  const response = await Axios.post(`common/uploadfile`, requestParam, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
const deleteFileService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`common/deletefile`, param);
  return response;
};
const breachlogService = {
  getAllService,
  getAllStatusService,
  getByIdService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
  uploadFileService,
  deleteFileService,
};
