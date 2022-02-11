import axios from "axios";
import config from "./config";

axios.defaults.baseURL = config.apiUrl;

export const fetchPasses = (op1_ID, op2_ID, date_from, date_to) => {
  const requestUrl = "PassesAnalysis/" + op1_ID + "/" + op2_ID + "/" + date_from + "/" + date_to + "?format=csv";
  return axios.get(requestUrl)
};

export const fetchSettlements = (op1_ID, op2_ID, date_from, date_to) => {
  const requestUrl = "PassesAnalysis/" + op1_ID + "/" + op2_ID + "/" + date_from + "/" + date_to + "?format=csv&settle=true";
  return axios.get(requestUrl)
};

export const fetchCosts = (op1_ID, op2_ID, date_from, date_to) => {
  const requestUrl = "PassesCost/" + op1_ID + "/" + op2_ID + "/" + date_from + "/" + date_to + "?format=json";
  return axios.get(requestUrl)
};
