const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var moment = require('moment');

function getPassesAnalysis(req, res) {
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
        res.send({status: 'failed', description: 'Please, give valid dates with format YYYYMMDD.'});
        return;
    }

    var con = mysql.createConnection({
        host: "localhost",
        user: "admin",
        password: "freepasses4all",
        database: "easy_pass",
        timezone: "eet"
    });

    //Make database connection and query.
    con.connect(function (err) {
        if (err) {
            res.status(500); // internal server error
            res.send({status:failed, description: "DB connection refused."});
            return;
        }

        if (req.query.settle == 'true'){
            var myquery = `SELECT ROW_NUMBER() OVER (ORDER BY TimeStamp) AS PassIndex, p.pass_id AS PassID, s.station_id AS StationID, p.timestamp AS TimeStamp, v.vehicle_id AS VehicleID, p.charge AS Charge, p.is_settled AS is_settled, p.is_paid AS is_paid FROM vehicles AS v, stations AS s, passes AS p WHERE v.vehicle_id = p.vehicle_ref AND s.station_id = p.station_ref AND v.tag_provider = ? AND s.station_provider = ? AND CAST(p.timestamp AS date) BETWEEN ? AND ?;`;
        }else if(req.query.settle == 'true' || req.query.settle == undefined){
            var myquery = `SELECT ROW_NUMBER() OVER (ORDER BY TimeStamp) AS PassIndex, p.pass_id AS PassID, s.station_id AS StationID, p.timestamp AS TimeStamp, v.vehicle_id AS VehicleID, p.charge AS Charge FROM vehicles AS v, stations AS s, passes AS p WHERE v.vehicle_id = p.vehicle_ref AND s.station_id = p.station_ref AND v.tag_provider = ? AND s.station_provider = ? AND CAST(p.timestamp AS date) BETWEEN ? AND ?;`;
        }else{
            res.status(400); // bad request
            res.send({ status: "failed", description: "settle should be true or false." });
        }
        con.query(myquery, [req.params.op2_ID, req.params.op1_ID, date_from, date_to], function (err, result, fields) {
            if (err) {
                res.status(500); // internal server error
                res.send("Query error.");
                return;
            }
            if (result.length == 0) {
                res.status(402); // no data
                res.send("No data.");
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
                            res.send({ status: "failed", description: "Convertion error." });
                            return;
                        }
                        res.attachment("PassesAnalysis.csv").send(csv);
                    }, { "delimiter": { "field": ';' } });
            }else{
                res.status(400); // bad request
                res.send({ status: "failed", description    : "Format should be json or csv." });
            }
        });
        con.end();
    });
}

router.get('/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to', getPassesAnalysis);
module.exports = router;
