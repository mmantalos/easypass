import axios from "axios";
import config from "./config";
var moment=require('moment');

axios.defaults.baseURL = config.apiUrl;

export const fetchPasses = (op1_ID, op2_ID, date_from, date_to) => {
  date_from=moment(date_from,'YYYY-MM-DD').format('YYYYMMDD');
  date_to=moment(date_to,'YYYY-MM-DD').format('YYYYMMDD');
  const requestUrl = "PassesAnalysis/" + op1_ID + "/" + op2_ID + "/" + date_from + "/" + date_to + "?format=csv";
  return axios.get(requestUrl);
};

export const fetchSettlements = (op1_ID, op2_ID, date_from, date_to) => {
  date_from=moment(date_from,'YYYY-MM-DD').format('YYYYMMDD');
  date_to=moment(date_to,'YYYY-MM-DD').format('YYYYMMDD');
  const requestUrl = "PassesAnalysis/" + op1_ID + "/" + op2_ID + "/" + date_from + "/" + date_to + "?format=csv&settle=true";
  return axios.get(requestUrl);
};

export const fetchPassesPerStation = (station_ID, date_from, date_to) => {
  date_from=moment(date_from,'YYYY-MM-DD').format('YYYYMMDD');
  date_to=moment(date_to,'YYYY-MM-DD').format('YYYYMMDD');
  const requestUrl = "PassesPerStation/" + station_ID + "/" + date_from + "/" + date_to + "?format=json";
  return axios.get(requestUrl);
};

export const fetchCosts = (op1_ID, op2_ID, date_from, date_to) => {
  date_from=moment(date_from,'YYYY-MM-DD').format('YYYYMMDD');
  date_to=moment(date_to,'YYYY-MM-DD').format('YYYYMMDD');
  const requestUrl = "PassesCost/" + op1_ID + "/" + op2_ID + "/" + date_from + "/" + date_to + "?format=json";
  return axios.get(requestUrl);
};

export const setSettlements = (op1_ID, op2_ID, date_from, date_to) => {
    //moment format correct?
    date_from=moment(date_from,'YYYY-MM-DD').format('YYYYMMDD');
    date_to=moment(date_to,'YYYY-MM-DD').format('YYYYMMDD');
    const requestUrl = "SetSettlement/" + op1_ID + "/" + op2_ID + "/" + date_from + "/" + date_to;
    return axios.post(requestUrl);
};

export const fetchChargesBy = (op1_ID, date_from, date_to) => {
  date_from=moment(date_from,'YYYY-MM-DD').format('YYYYMMDD');
  date_to=moment(date_to,'YYYY-MM-DD').format('YYYYMMDD');
  const requestUrl = "ChargesBy/" + op1_ID + "/" + date_from + "/" + date_to + "?format=json";
  return axios.get(requestUrl);
};
