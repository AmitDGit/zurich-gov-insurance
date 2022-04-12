import { regionConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = () => {
  const request = () => {
    return { type: regionConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: regionConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: regionConstants.GETALL_FAILURE, payload: error };
  };
  const requestParams = {
    PageIndex: 1,
    PageSize: 50,
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await regionService.getAllService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllRegions = (requestParam) => {
  const success = (data) => {
    return { type: regionConstants.GETALLREGION_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: regionConstants.GETALLREGION_FAILURE, payload: error };
  };
  const requestParams = requestParam ? requestParam : {};
  /*const requestParams = {
    PageIndex: 1,
    PageSize: 50,
  };*/

  return async (dispatch) => {
    try {
      const response = await regionService.getAllRegionsService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getUserRegions = (requestParams) => {
  return async (dispatch) => {
    try {
      const response = await regionService.getAllRegionsService(requestParams);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await regionService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkRegionExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await regionService.checkRegionExistService(
        requestParam
      );
      return response.data;
    } catch (err) {}
  };
};
const checkRegionInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await regionService.checkRegionInUseService(
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
      const response = await regionService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await regionService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const regionActions = {
  getAll,
  getAllRegions,
  getUserRegions,
  getById,
  postItem,
  deleteItem,
  checkRegionExist,
  checkRegionInUse,
};

const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`region/getallregionlist`, param);
  return response;
};
const getAllRegionsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`region/getallregion`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`region/getregion`, param);
  return response;
};
const checkRegionExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`region/isregionnameinuse`, param);
  return response;
};
const checkRegionInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`region/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(`region/addeditregion`, requestParam);
  return response;
};
const putItemService = async (requestParam) => {
  const response = await Axios.put();
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`region/deleteregion`, param);
  return response;
};
const regionService = {
  getAllService,
  getAllRegionsService,
  getByIdService,
  postItemService,
  putItemService,
  deleteItemService,
  checkRegionExistService,
  checkRegionInUseService,
};
