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

const getActionResponsible = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await breachlogService.getActionResponsibleService(
        requestParam
      );
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
const getAllCount = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await breachlogService.getAllCountService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getallLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await breachlogService.getallLogsService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const breachlogActions = {
  getAll,
  getAllCount,
  getallLogs,
  getAllStatus,
  getById,
  checkIsInUse,
  postItem,
  deleteItem,
  getActionResponsible,
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
const getActionResponsibleService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`breachlog/getallactionresponsible`, param);
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
const getAllCountService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`breachlog/getallbreachlogs`, param);
  return response;
};
const getallLogsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`breachlog/getallbreachlogs`, param);
  return response;
};
const breachlogService = {
  getAllService,
  getAllCountService,
  getallLogsService,
  getAllStatusService,
  getByIdService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
  getActionResponsibleService,
};
