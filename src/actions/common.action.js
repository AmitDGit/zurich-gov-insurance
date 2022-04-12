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
const downloadFile = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.downloadFileService(requestParam);
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
const sendLogNotification = (requestParam) => {
  return async (dispatch) => {
    try {
      const response = await commonService.sendLogNotificationService(
        requestParam
      );
      return response.data;
    } catch (err) {
      return false;
    }
  };
};
export const commonActions = {
  uploadFile,
  deleteFile,
  downloadFile,
  getToolTip,
  sendLogNotification,
};
const uploadFileService = async (requestParam) => {
  const response = await Axios.post(`common/uploadfile`, requestParam, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
const downloadFileService = async (requestParam) => {
  const param = { params: requestParam, responseType: "blob" };
  const response = await Axios.get(`common/downloadazureblob`, param);
  return response;
};
const deleteFileService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.delete(`common/deletefile`, param);
  console.log(response);
  return response;
};
const getToolTipService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/gettooltiptext`, param);
  return response;
};
const sendLogNotificationService = async (requestParam) => {
  const param = { params: requestParam };
  const response = await Axios.get(`common/sendlognotification`, param);
  return response;
};
const commonService = {
  uploadFileService,
  deleteFileService,
  downloadFileService,
  getToolTipService,
  sendLogNotificationService,
};
