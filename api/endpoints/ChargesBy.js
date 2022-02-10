const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
let converter = require('json-2-csv');

function getChargesBy(req, res) {
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
        res.send({ "status": "failed", "description": "Date format should be YYYYMMDD." });
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
            res.send({ "status": "failed", "description": "DB connection refused." });
            return;
        }
        let myquery = `SELECT tag_provider as VisitingOperator, COUNT(pass_id) as NumberOfPasses, SUM(charge) as PassesCost FROM stations, vehicles, passes WHERE station_provider = "${req.params["op_ID"]}" AND tag_provider <> "${req.params["op_ID"]}" AND timestamp BETWEEN "${req.params["date_from"]}" AND "${req.params["date_to"]}" AND station_ref = station_id AND vehicle_ref = vehicle_id GROUP BY tag_provider;`;
        con.query(myquery, function (err, result, fields) {
            console.log(myquery);
            if (err) {
                res.status(500); // internal server error
                res.send({ "status": "failed", "description": "Query error." });
                return;
            }
            if (result.length == 0) {
                res.status(402); // no data
                res.send({ "status": "failed", "description": "No data." });
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
                            res.send({ "status": "failed", "description": "Convertion error." });
                            return;
                        }
                        res.send(csv);
                    }, { "delimiter": { "field": ';' } });
            }
            else {
                res.status(400); // bad request
                res.send({ "status": "failed", "description": "Format should be json or csv." });
            }
        });
        con.end();
    });
}

router.get('/ChargesBy/:op_ID/:date_from/:date_to', getChargesBy);
module.exports = router;