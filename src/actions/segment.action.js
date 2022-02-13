import { segmentConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = (requestParam) => {
  const request = () => {
    return { type: segmentConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: segmentConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: segmentConstants.GETALL_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await segmentService.getAllService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllSegment = (requestParam) => {
  const success = (data) => {
    return { type: segmentConstants.GETALLSEGMENT_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: segmentConstants.GETALLSEGMENT_FAILURE, payload: error };
  };

  return async (dispatch) => {
    try {
      const response = await segmentService.getAllService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await segmentService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await segmentService.checkNameExistService(requestParam);
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await segmentService.checkIsInUseService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await segmentService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await segmentService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const segmentActions = {
  getAll,
  getAllSegment,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`segment/getallsegmentlist`, param);
  return response;
};

const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`segment/getsegment`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`segment/issegmentnameinuse`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`segment/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(`segment/addeditsegment`, requestParam);
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`segment/deletesegment`, param);
  return response;
};
const segmentService = {
  getAllService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
};
