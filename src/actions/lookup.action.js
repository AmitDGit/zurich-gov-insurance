import { lookupConstants } from "../constants";
import Axios from "../services/Axios";

const getAllBreachLog = (requestParam) => {
  const request = () => {
    return { type: lookupConstants.GETLOGTYPE_REQUEST };
  };
  const success = (data) => {
    return { type: lookupConstants.GETBREACHLOGTYPE_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: lookupConstants.GETBREACHLOGTYPE_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await lookupService.getAllBreachLogService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getLogTypes = (requestParam) => {
  const request = () => {
    return { type: lookupConstants.GETLOGTYPE_REQUEST };
  };
  const success = (data) => {
    return { type: lookupConstants.GETLOGTYPE_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: lookupConstants.GETLOGTYPE_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await lookupService.getLookupByTypeService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getLookupByType = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lookupService.getLookupByTypeService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lookupService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lookupService.checkNameExistService(requestParam);
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lookupService.checkIsInUseService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postBrachLogItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lookupService.postBrachLogService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lookupService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const lookupActions = {
  getLogTypes,
  getAllBreachLog,
  getLookupByType,
  getById,
  checkNameExist,
  checkIsInUse,
  postBrachLogItem,
  deleteItem,
};
const getAllBreachLogService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lookup/getallbreachloglookup`, param);
  return response;
};

const getLookupByTypeService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lookup/getlookupbytype`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lookup/getbreachloglookup`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lookup/islookupnameinuse`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lookup/isinusecount`, param);
  return response;
};
const postBrachLogService = async (requestParam) => {
  const response = await Axios.post(
    `lookup/addeditbreachloglookup`,
    requestParam
  );
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`lookup/deletelookup`, param);
  return response;
};
const lookupService = {
  getAllBreachLogService,
  getLookupByTypeService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postBrachLogService,
  deleteItemService,
};
