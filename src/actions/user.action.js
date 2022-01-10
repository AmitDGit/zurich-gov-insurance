import { userConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = (requestParam) => {
  const request = () => {
    return { type: userConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: userConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: userConstants.GETALL_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await userService.getAllService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllUsers = (requestParam) => {
  const success = (data) => {
    return { type: userConstants.GETALLUSER_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: userConstants.GETALLUSER_FAILURE, payload: error };
  };
  return async (dispatch) => {
    try {
      const response = await userService.getAllUserService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllRegion = (requestParam) => {
  const success = (data) => {
    return { type: userConstants.GETALLREGION_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: userConstants.GETALLREGION_FAILURE, payload: error };
  };
  return async (dispatch) => {
    try {
      const response = await userService.getAllRegionService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllCountry = (requestParam) => {
  const success = (data) => {
    return { type: userConstants.GETALLCOUNTRY_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: userConstants.GETALLCOUNTRY_FAILURE, payload: error };
  };
  return async (dispatch) => {
    try {
      const response = await userService.getAllCountryService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllUsersRoles = (requestParam) => {
  const success = (data) => {
    return { type: userConstants.GETALLUSERROLE_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: userConstants.GETALLUSERROLE_FAILURE, payload: error };
  };
  return async (dispatch) => {
    try {
      const response = await userService.getAllUsersRolesService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getAllSpecialUsers = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await userService.getAllSpecialUsersService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const getById = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await userService.getByIdService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const checkNameExist = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await userService.checkNameExistService(requestParam);
      return response.data;
    } catch (err) {}
  };
};
const checkIsInUse = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await userService.checkIsInUseService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const postItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await userService.postItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItem = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await userService.deleteItemService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const userActions = {
  getAll,
  getAllUsers,
  getAllCountry,
  getAllRegion,
  getAllSpecialUsers,
  getAllUsersRoles,
  getById,
  checkNameExist,
  checkIsInUse,
  postItem,
  deleteItem,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`user/getallspecialuserlist`, param);
  return response;
};
const getAllUserService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`user/getalladuserlist`, param);
  return response;
};
const getAllRegionService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`region/getallregion`, param);
  return response;
};
const getAllCountryService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`country/getallcountry`, param);
  return response;
};

const getAllSpecialUsersService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`user/getallspecialuserlist`, param);
  return response;
};
const getAllUsersRolesService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`systemrole/getallroles`, param);
  return response;
};
const getByIdService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`user/getspecialuser`, param);
  return response;
};
const checkNameExistService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`user/isuserexist`, param);
  return response;
};
const checkIsInUseService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`user/isinusecount`, param);
  return response;
};
const postItemService = async (requestParam) => {
  const response = await Axios.post(`user/addeditspecialuser`, requestParam);
  return response;
};
const deleteItemService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`user/deletespecialuser`, param);
  return response;
};
const userService = {
  getAllService,
  getAllUserService,
  getAllRegionService,
  getAllCountryService,
  getAllSpecialUsersService,
  getAllUsersRolesService,
  getByIdService,
  checkNameExistService,
  checkIsInUseService,
  postItemService,
  deleteItemService,
};
