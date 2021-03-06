const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
const db = require('../config.json');


function getPassesAnalysis(req, res) {
    console.log(req.url);

    //get current date string with format "yyyy-mm-dd hh:mm:ss" from date object
    var reqTmstmp = moment(new Date()).format('YYYY-MM-DD hh:mm:ss') //check if mm is correct (probably mi?)
    var date_from = req.params["date_from"];
    var date_to = req.params["date_to"];
    //check if input dates have "YYYYMMDD" format and in that case convert them to YYYY-MM-DD
    if (moment(date_from, 'YYYYMMDD', true).isValid() && moment(date_to, 'YYYYMMDD', true).isValid()) {
        date_from = moment(date_from).format('YYYY-MM-DD');
        date_to = moment(date_to).format('YYYY-MM-DD');
    } else {
        res.status(400);
        res.send({ status: 'failed', details: 'Date format should be YYYYMMDD.' });
        return;
    }

    var con = mysql.createConnection({
        host: db.host,
        user: db.user,
        password: db.password,
        database: db.database,
        timezone: db.timezone
    });

    //Make database connection and query.
    con.connect(function (err) {
        if (err) {
            res.status(500); // internal server error
            res.send({ status: 'failed', details: "DB connection refused." });
            return;
        }

        if (req.query.settle == 'true') {
            var myquery = `SELECT ROW_NUMBER() OVER (ORDER BY TimeStamp) AS PassIndex, p.pass_id AS PassID, s.station_id AS StationID, p.timestamp AS TimeStamp, v.vehicle_id AS VehicleID, p.charge AS Charge, p.is_settled AS is_settled FROM vehicles AS v, stations AS s, passes AS p WHERE v.vehicle_id = p.vehicle_ref AND s.station_id = p.station_ref AND v.tag_provider = ? AND s.station_provider = ? AND DATE(p.timestamp) BETWEEN ? AND ?;`;
        } else if (req.query.settle == 'false' || req.query.settle == undefined) {
            var myquery = `SELECT ROW_NUMBER() OVER (ORDER BY TimeStamp) AS PassIndex, p.pass_id AS PassID, s.station_id AS StationID, p.timestamp AS TimeStamp, v.vehicle_id AS VehicleID, p.charge AS Charge FROM vehicles AS v, stations AS s, passes AS p WHERE v.vehicle_id = p.vehicle_ref AND s.station_id = p.station_ref AND v.tag_provider = ? AND s.station_provider = ? AND DATE(p.timestamp) BETWEEN ? AND ?;`;
        } else {
            res.status(400); // bad request
            res.send({ status: "failed", details: "settle should be true or false." });
            con.end();
            return;
        }
        con.query(myquery, [req.params.op2_ID, req.params.op1_ID, date_from, date_to], function (err, result, fields) {
            if (err) {
                res.status(500); // internal server error
                res.send({ status: 'failed', details: 'Query error.' });
                return;
            }
            if (result.length == 0) {
                res.status(402); // no data
                res.send({ status: 'failed', details: 'No data.' });
                return;
            }
            if (req.query.format == 'json' || req.query.format == undefined) {
                var output = {
                    op1_ID: req.params.op1_ID,
                    op2_ID: req.params.op2_ID,
                    RequestTimestamp: reqTmstmp,
                    PeriodFrom: date_from,
                    PeriodTo: date_to,
                    NumberOfPasses: result.length,
                    PassesList: result
                }
                res.send(output);
            } else if (req.query.format == 'csv') {
                let converter = require('json-2-csv');
                converter.json2csv(result,
                    function (err, csv) {
                        if (err) {
                            res.status(500); // internal server error
                            res.send({ status: "failed", details: "Conversion error." });
                            return;
                        }
                        res.send(csv);
                    }, { "delimiter": { "field": ';' } });
            } else {
                res.status(400); // bad request
                res.send({ status: "failed", details: "Format should be json or csv." });
                return;
            }
        });
        con.end();
    });
}

router.get('/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to', getPassesAnalysis);
module.exports = router;
