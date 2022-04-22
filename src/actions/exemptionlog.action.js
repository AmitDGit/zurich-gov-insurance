import { exemptionlogConstants } from "../constants";
import Axios from "../services/Axios";
const getAll = (requestParam) => {
  const request = () => {
    return { type: exemptionlogConstants.GETALL_REQUEST };
  };
  const success = (data) => {
    return { type: exemptionlogConstants.GETALL_SUCCESS, payload: data };
  };
  const failure = (error) => {
    return { type: exemptionlogConstants.GETALL_FAILURE, payload: error };
  };

  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await exemptionlogService.getAllService(requestParam);
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
const getallZUGLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getallZUGLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getallZUGCount = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getallZUGCountService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getByIdZUG = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getByIdZUGService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const postItemZUG = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.postItemZUGService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteItemZUG = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.deleteItemZUGService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const getallZUGunderwriter = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getallZUGunderwriterService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const getallURPMLogs = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getallURPMLogsService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getByIdURPM = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.getByIdURPMService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};

const postItemURPM = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await exemptionlogService.postItemURPMService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const exemptionlogActions = {
  getAll,
  getallZUGCount,
  getallZUGLogs,
  getallZUGunderwriter,
  getByIdZUG,
  postItemZUG,
  deleteItemZUG,

  getallURPMLogs,
  getByIdURPM,
  postItemURPM,
};
const getAllService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/getallzugexemptionlog`, param);
  return response;
};
const getallZUGCountService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/getallzugexemptionlog`, param);
  return response;
};
const getallZUGLogsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/getallzugexemptionlog`, param);
  return response;
};
const getByIdZUGService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/getzugexemptionlog`, param);
  return response;
};

const postItemZUGService = async (requestParam) => {
  const response = await Axios.post(
    `exemption/addeditzugexemptionlog`,
    requestParam
  );
  return response;
};
const deleteItemZUGService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`rfelog/deleterfelog`, param);
  return response;
};
const getallZUGunderwriterService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`rfelog/getallunderwriter`, param);
  return response;
};

const getallURPMLogsService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/getallurpmexemptionlog`, param);
  return response;
};
const getByIdURPMService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`exemption/geturpmexemptionlog`, param);
  return response;
};
const postItemURPMService = async (requestParam) => {
  debugger;
  const response = await Axios.post(
    `exemption/addediturpmexemptionlog`,
    requestParam
  );
  console.log(response);
  return response;
};
const exemptionlogService = {
  getAllService,
  getallZUGCountService,
  getallZUGLogsService,
  getByIdZUGService,
  postItemZUGService,
  deleteItemZUGService,
  getallZUGunderwriterService,

  getallURPMLogsService,
  getByIdURPMService,
  postItemURPMService,
};
