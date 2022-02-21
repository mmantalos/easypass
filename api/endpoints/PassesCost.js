const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
const j2c = require('json2csv');

function getPassesCost(req, res) {
  console.log(req.url);

  //get current date string with format "yyyy-mm-dd hh:mm:ss" from date object
  var reqTmstmp = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
  var date_from = req.params["date_from"];
  var date_to = req.params["date_to"];
  //check if input dates have "YYYYMMDD" format and in that case convert them to YYYY-MM-DD
  if (moment(date_from, 'YYYYMMDD', true).isValid() && moment(date_to, 'YYYYMMDD', true).isValid()) {
    date_from = moment(date_from).format('YYYY-MM-DD');
    date_to = moment(date_to).format('YYYY-MM-DD');
  }
  else {
    res.status(400); // bad request
    res.send({ "status": "failed", "details": "Date format should be YYYYMMDD." });
    return;
  }
  date_fr = moment(req.params.date_from, 'YYYYMMDD').format('YYYY-MM-DD');
  date_to = moment(req.params.date_to, 'YYYYMMDD').format('YYYY-MM-DD');

  var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "freepasses4all",
    database: "easy_pass",
    timezone: "eet"
  });

  //Make database connection and query. Error handling???
  con.connect(function (err) {
    if (err) {
      res.status(500); // internal server error
      res.send({ "status": "failed", "details": "DB connection refused." });
      return;
    }

    let myquery = `SELECT COUNT(p.pass_id) AS NumberOfPasses, COALESCE(SUM(p.charge), 0) AS PassesCost FROM vehicles AS v, stations AS s, passes AS p WHERE p.is_settled = 0 AND v.vehicle_id = p.vehicle_ref AND s.station_id = p.station_ref AND v.tag_provider = "${req.params["op2_ID"]}" AND s.station_provider = "${req.params["op1_ID"]}" AND DATE(p.timestamp) BETWEEN "${req.params["date_from"]}" AND "${req.params["date_to"]}";`;
    con.query(myquery, function (err, result, fields) {
      if (err) {
        res.status(500); // internal server error
        res.send({ "status": "failed", "details": "Query error." });
        return;
      }
      var output = {
        op1_ID: req.params["op1_ID"],
        op2_ID: req.params["op2_ID"],
        RequestTimestamp: reqTmstmp,
        PeriodFrom: date_fr,
        PeriodTo: date_to,
        NumberOfPasses: result[0].NumberOfPasses,
        PassesCost: result[0].PassesCost
      }
      if (result.length == 0) {
        res.status(402); // no data
        res.send({ "status": "failed", "details": "No data." });
        return;
      }
      if (req.query.format == 'json' || req.query.format == undefined) {
        res.send(output);
      } else if (req.query.format == 'csv') {
        let converter = require('json-2-csv');
        converter.json2csv(result,
          function (err, csv) {
            if (err) {
              res.status(500); // internal server error
              res.send({ "status": "failed", "details": "Conversion error." });
              return;
            }
            res.send(csv);
          }, { "delimiter": { "field": ';' } });
      }
      else {
        res.status(400); // bad request
        res.send({ "status": "failed", "details": "Format should be json or csv." });
      }
    });
    con.end();
  });
}
router.get('/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to', getPassesCost);
module.exports = router;
