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
        res.status(400);
        res.send({ "status": "failed" });
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
    try {
        con.connect(function (err) {
            if (err) throw err;
            let myquery = `SELECT tag_provider as VisitingOperator, COUNT(pass_id) as NumberOfPasses, SUM(charge) as PassesCost FROM stations, vehicles, passes WHERE station_provider = "${req.params["op_ID"]}" AND tag_provider <> "${req.params["op_ID"]}" AND timestamp BETWEEN "${req.params["date_from"]}" AND "${req.params["date_to"]}" AND station_ref = station_id AND vehicle_ref = vehicle_id GROUP BY tag_provider;`;
            con.query(myquery, function (err, result, fields) {
                console.log(myquery);
                if (err) throw err;
                if (result.length == 0) {
                    res.status(402); // no data
                }
                var output = {
                    op_ID: req.params["op_ID"],
                    RequestTimestamp: reqTmstmp,
                    PeriodFrom: req.params["date_from"],
                    PeriodTo: req.params["date_to"],
                    NumberOfCharges: result.length,
                    PPOList: result
                }
                if (req.query.format == 'csv') {
                    converter.json2csv(result,
                        function (err, csv) {
                            if (err) throw err;
                            res.send(csv);
                        }, { "delimiter": { "field": ';' } });
                }
                else res.send(output);
            });
            con.end();
        });
    }

    catch (err) {
        res.status(500); // internal server error
        res.send({ "status": "failed" });
        return;
    }
}

router.get('/ChargesBy/:op_ID/:date_from/:date_to', getChargesBy);
module.exports = router;