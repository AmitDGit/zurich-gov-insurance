import { countryConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = () => {
  const request = () => {
    return { type: countryConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: countryConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: countryConstants.GETALL_FAILURE, payload: error };
  };
  const requestParams = {};

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await countryService.getAllService(requestParams);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllCountry = (requestParam) => {
  const success = (data) => {
    return { type: countryConstants.GETALLCOUNTRY_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: countryConstants.GETALLCOUNTRY_FAILURE, payload: error };
  };
  let requestParams = requestParam ? requestParam : {};
  /*const requestParams = {
    PageIndex: 1,
    PageSize: 50,
  };*/
  return async (dispatch) => {
    try {
      const response = await countryService.getAllCountryService(requestParams);
      dispatch(success(response.data));
      return response.data;
    } catch (err) {
      dispatch(failure(err));
      return false;
    }
  };
};

const getUserCountry = (requestParams) => {
  return async (dispatch) => {
    try {
      const response = await countryService.getAllCountryService(requestParams);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await countryService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await countryService.checkNameExistService(requestParam);
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await countryService.checkIsInUseService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await countryService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await countryService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const countryActions = {
  getAll,
  getAllCountry,
  getUserCountry,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`country/getallcountrylist`, param);
  return response;
};
const getAllCountryService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`country/getallcountry`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`country/getcountry`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`country/iscountrynameinuse`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`country/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(`country/addeditcountry`, requestParam);
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`country/deletecountry`, param);
  return response;
};
const countryService = {
  getAllService,
  getAllCountryService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
};
