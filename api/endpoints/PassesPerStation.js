const express = require('express');
const router = express.Router();
var moment = require('moment');
var mysql = require('mysql');
const db = require('../config.json');



function PassesPerStation(req, res) {
  console.log(req.url);
  console.log(db.user);
  var con = mysql.createConnection({
      host: db.host,
      user: db.user,
      password: db.password,
      database: db.database,
      timezone: db.timezone
  });
  //get the date from which the resulting passes will start
  //and check if it is in the right format

  if (!moment(req.params.date_from, 'YYYYMMDD', true).isValid()) {
    res.status(400); // bad request
    res.send({ "status": "failed", "details": "Date format should be YYYYMMDD." });
    return;
  }

  date_fr = moment(req.params.date_from, 'YYYYMMDD').format('YYYY-MM-DD');
  //get the date that the resulting passes will end

  if (!moment(req.params.date_to, 'YYYYMMDD', true).isValid()) {
    res.status(400);
    res.send({ 'status': "failed", "details": "Date format should be YYYYMMDD." });
    return;
  }

  date_to = moment(req.params.date_to, 'YYYYMMDD').format('YYYY-MM-DD');

  var curr_timestamp = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
  con.connect(function (err) {
    if (err) {
      res.status(500); // db connection error
      res.send({ "status": "failed", "details": "DB connection refused." });
      return;
    }


    //use auxilliary query to get the provider of the station.
    let auxquery = "select station_provider from stations where station_id=?";

    //use the main query to get the passes requested.
    let mainquery = "with gstation_provider(station_id,station_provider) as (select station_id,station_provider from stations where station_id=?)select ROW_NUMBER() over (order by timestamp) as PassIndex,pass_id as PassID,timestamp as PassTimeStamp,vehicle_ref as VehicleID,tag_provider as TagProvider,if(tag_provider=station_provider,'home','visitor') as PassType,charge as PassCharge from passes join vehicles on passes.vehicle_ref=vehicles.vehicle_id, gstation_provider where station_ref=station_id and DATE(passes.timestamp) between ? and ? order by timestamp;"
    con.query(auxquery, [req.params.stationID], function (err, result, fields) {
      if (err) {
        res.status(500); // query error
        res.send({ "status": "failed", "details": "Query error." });
        return;
      }
      StationOperator = result[0].station_provider;//query has only one result which is the operator that this station belongs to

      //Perform the main query to get the list of passes.
      con.query(mainquery, [req.params.stationID, date_fr, date_to],
        function (err, mainresult, fields) {
          if (err) {
            res.status(500); // query error
            res.send({ "status": "failed", "details": "Query error." });
            return;
          }
          if (mainresult.length == 0) {
            res.status(402); // no data
            res.send({ "status": "failed", "details": "No data." });
            return;
          }
          if (req.query.format == 'json' || req.query.format == undefined) {
            output = {
              "Station": req.params.stationID,
              "StationOperator": StationOperator,
              "RequestTimestamp": curr_timestamp,
              "PeriodFrom": date_fr,
              "PeriodTo": date_to,
              "NumberOfPasses": mainresult.length,
              "PassesList": mainresult
            }
            res.send(output);//change later to contain the results of auxquery
          }
          else if (req.query.format == 'csv') {
            //if the required format is csv we need to convert the array of json mainresult to a csv string
            let converter = require('json-2-csv');
            converter.json2csv(mainresult,
              function (err, csv) {
                if (err) {
                  res.status(500); // internal server error
                  res.send({ "status": "failed", "details": "Conversion error." });
                }
                res.send(csv);
              }, { "delimiter": { "field": ';' } });
          }
          //the requested format is neither csv nor json.
          else {
            res.status(400); // bad request
            res.send({ "status": "failed", "details": "Format should be json or csv." });
          }
        }
      );
    });
  })
}
router.get('/PassesPerStation/:stationID/:date_from/:date_to', PassesPerStation);
module.exports = router;
