import axios from "axios";
import config from "./config";

axios.defaults.baseURL = config.apiUrl;

export const fetchData = obj => {
  const requestUrl = "PassesAnalysis/aodos/moreas/20210101/20210510?format=json";
  return axios.get(requestUrl)
};
