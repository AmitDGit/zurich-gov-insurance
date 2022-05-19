import { znaorgnization1Constants } from "../constants";
import Axios from "../services/Axios";
const getAll = () => {
  const request = () => {
    return { type: znaorgnization1Constants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: znaorgnization1Constants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: znaorgnization1Constants.GETALL_FAILURE, payload: error };
  };
  const requestParams = {
    PageIndex: 1,
    PageSize: 500,
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await OrgnizationService.getAllService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllOrgnization = (requestParam) => {
  const success = (data) => {
    return {
      type: znaorgnization1Constants.GETALLORGNIZATION_SUCCESS,
      payload: data,
    };
  };
  const failure = (error) => {
    return {
      type: znaorgnization1Constants.GETALLORGNIZATION_FAILURE,
      payload: error,
    };
  };
  let requestParams = requestParam ? requestParam : {};
  /*const requestParams = {
    PageIndex: 1,
    PageSize: 50,
  };*/
  return async (dispatch) => {
    try {
      const response = await OrgnizationService.getAllOrgnizationService(
        requestParams
      );
      dispatch(success(response.data));
      return response.data;
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await OrgnizationService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await OrgnizationService.checkNameExistService(
        requestParam
      );
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await OrgnizationService.checkIsInUseService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await OrgnizationService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await OrgnizationService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const znaorgnization1Actions = {
  getAll,
  getAllOrgnization,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`znaorganisation/getallznasegment`, param);
  return response;
};
const getAllOrgnizationService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(
    `znaorganisation/getallznasegmentbreach`,
    param
  );
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`znaorganisation/getznasegment`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(
    `znaorganisation/isznafieldnameinuse`,
    param
  );
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`znaorganisation/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(
    `znaorganisation/addeditznasegment`,
    requestParam
  );
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(
    `znaorganisation/deletznaorganisation`,
    param
  );
  return response;
};
const OrgnizationService = {
  getAllService,
  getAllOrgnizationService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
};
