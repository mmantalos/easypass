const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var moment = require('moment');

function SetSettlement(req, res) {
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
            res.send({ status: 'failed', details: "DB connection refused." });
            return;
        }
        var myquery = 'UPDATE passes AS p, vehicles AS v, stations AS s SET p.is_settled = 1 WHERE p.vehicle_ref = v.vehicle_id AND p.station_ref = s.station_id AND v.tag_provider = ? AND s.station_provider = ? AND DATE(p.timestamp) BETWEEN ? AND ?;'
        con.query(myquery, [req.params.op2_ID, req.params.op1_ID, date_from, date_to], function (err, result, fields) {
            if (err) {
                res.status(500);
                res.send({ status: "failed" });
            }
            else
                res.send({ status: "OK" });
        });
        con.end();
    });
}

router.post('/SetSettlement/:op1_ID/:op2_ID/:date_from/:date_to', SetSettlement);
module.exports = router;
