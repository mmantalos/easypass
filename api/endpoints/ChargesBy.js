const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
let converter = require('json-2-csv');
const db = require('../config.json');


function getChargesBy(req, res) {
    console.log(req.url);

    //get current date string with format "yyyy-mm-dd hh:mm:ss" from date object
    var reqTmstmp = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')

    var date_from = req.params["date_from"];
    var date_to = req.params["date_to"];

    //check if input dates have "YYYYMMDD" format and convert them to YYYY-MM-DD
    if (moment(date_from, 'YYYYMMDD', true).isValid() && moment(date_to, 'YYYYMMDD', true).isValid()) {
        date_from = moment(date_from).format('YYYY-MM-DD');
        date_to = moment(date_to).format('YYYY-MM-DD');
    } else {
        res.status(400); // bad request
        res.send({ "status": "failed", "details": "Date format should be YYYYMMDD." });
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
            res.send({ "status": "failed", "details": "DB connection refused." });
            return;
        }
        let myquery = `SELECT tag_provider as VisitingOperator, COUNT(pass_id) as NumberOfPasses, SUM(charge) as PassesCost FROM stations, vehicles, passes WHERE station_provider = "${req.params["op_ID"]}" AND tag_provider <> "${req.params["op_ID"]}" AND DATE(timestamp) BETWEEN "${req.params["date_from"]}" AND "${req.params["date_to"]}" AND station_ref = station_id AND vehicle_ref = vehicle_id GROUP BY tag_provider;`;
        con.query(myquery, function (err, result, fields) {
            if (err) {
                res.status(500); // internal server error
                res.send({ "status": "failed", "details": "Query error." });
                return;
            }
            if (result.length == 0) {
                res.status(402); // no data
                res.send({ "status": "failed", "details": "No data." });
                return;
            }
            var output = {
                op_ID: req.params["op_ID"],
                RequestTimestamp: reqTmstmp,
                PeriodFrom: date_from,
                PeriodTo: date_to,
                PPOList: result
            }
            if (req.query.format == 'json' || req.query.format == undefined)
                res.send(output);
            else if (req.query.format == 'csv') {
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
                return;
            }
        });
        con.end();
    });
}

router.get('/ChargesBy/:op_ID/:date_from/:date_to', getChargesBy);
module.exports = router;
