import { lobchapterConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = (requestParam) => {
  const request = () => {
    return { type: lobchapterConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: lobchapterConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: lobchapterConstants.GETALL_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await lobchapterService.getAllService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAlllobChapter = () => {
  const success = (data) => {
    return {
      type: lobchapterConstants.GETALLLOBCHAPTER_SUCCESS,
      payload: data,
    };
  };
  const failure = (error) => {
    return {
      type: lobchapterConstants.GETALLLOBCHAPTER_FAILURE,
      payload: error,
    };
  };
  const requestParams = {
    PageIndex: 1,
    PageSize: 500,
  };

  return async (dispatch) => {
    try {
      const response = await lobchapterService.getAlllobChapterService(
        requestParams
      );
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lobchapterService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lobchapterService.checkNameExistService(
        requestParam
      );
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lobchapterService.checkIsInUseService(
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
      const response = await lobchapterService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await lobchapterService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const lobchapterActions = {
  getAll,
  getAlllobChapter,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lobchapter/getalllobchapterlist`, param);
  return response;
};
const getAlllobChapterService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lobchapter/getalllobchapter`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lobchapter/getlobchapter`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lobchapter/islobchapternameinuse`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`lobchapter/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(
    `lobchapter/addeditlobchapter`,
    requestParam
  );
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`lobchapter/deletelobchapter`, param);
  return response;
};
const lobchapterService = {
  getAllService,
  getAlllobChapterService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
};
