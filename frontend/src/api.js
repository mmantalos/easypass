import axios from "axios";
import config from "./config";

axios.defaults.baseURL = config.apiUrl;

export const fetchData = (op1_ID, op2_ID, date_from, date_to) => {
  const requestUrl = "PassesAnalysis/" + op1_ID + "/" + op2_ID + "/" + date_from + "/" + date_to + "?format=json";
  return axios.get(requestUrl)
};
