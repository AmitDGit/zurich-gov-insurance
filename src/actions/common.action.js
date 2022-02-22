import Axios from "../services/Axios";
const uploadFile = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.uploadFileService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const deleteFile = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.deleteFileService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
const getToolTip = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.getToolTipService(requestParam);
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const commonActions = {
  uploadFile,
  deleteFile,
  getToolTip,
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
const getToolTipService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/gettooltiptext`, param);
  return response;
};
const commonService = {
  uploadFileService,
  deleteFileService,
  getToolTipService,
};
