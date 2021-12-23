import { regionConstants } from "../constants";
import axios from "axios";
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
  return async (dispatch) => {
    dispatch(request());
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/albums"
      );
      dispatch(success(response.data));
    } catch (err) {
      dispatch(failure(err));
    }
  };
};
export const regionActions = {
  getAll,
};
