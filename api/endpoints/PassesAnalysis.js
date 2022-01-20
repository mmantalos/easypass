const express = require('express');
const router = express.Router();
var mysql = require('mysql');
var moment = require('moment');
// const j2c= require('json2csv');

function getPassesAnalysis(req,res){
    //get current date string with format "yyyy-mm-dd hh:mm:ss" from date object
    var reqTmstmp = moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
    var date_from = req.params["date_from"];
    var date_to = req.params["date_to"];
    //check if input dates have "YYYYMMDD" format and in that case convert them to YYYY-MM-DD
    if(moment(date_from, 'YYYYMMDD', true).isValid() && moment(date_to, 'YYYYMMDD', true).isValid()){
        date_from = moment(date_from).format('YYYY-MM-DD');
        date_to = moment(date_to).format('YYYY-MM-DD');
    }else{
        res.status(400);
        res.send('Please, give valid dates with format YYYYMMDD.');
        return;
    }
    console.log(date_from);
    console.log(date_to);

    var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "freepasses4all",
    database:"easy_pass",
    timezone: "eet"
    });

    //Make database connection and query.
    con.connect(function(err) {
    	if (err){
            res.status(500); // internal server error
            res.send("DB connection refused.");
            return;
        };
    	console.log("Connected!");

        let myquery = `SELECT ROW_NUMBER() OVER (ORDER BY TimeStamp) AS PassIndex, p.pass_id AS PassID, s.station_id AS StationID, p.timestamp AS TimeStamp, v.vehicle_id AS VehicleID, p.charge AS Charge FROM vehicles AS v, stations AS s, passes AS p WHERE v.vehicle_id = p.vehicle_ref AND s.station_id = p.station_ref AND v.tag_provider = "${req.params["op2_ID"]}" AND s.station_provider = "${req.params["op1_ID"]}" AND CAST(p.timestamp AS date) BETWEEN "${req.params["date_from"]}" AND "${req.params["date_to"]}";`;
        con.query(myquery, function (err, result, fields){
    		if (err){
                res.status(500); // internal server error
                res.send("Query error.");
                return;
            }
            var output = {
                op1_ID : req.params["op1_ID"],
                op2_ID : req.params["op2_ID"],
                RequestTimestamp : reqTmstmp,
                PeriodFrom : date_from,
                PeriodTo : date_to,
                NumberOfPasses : result.length,
                PassesList : result
            }
            if(result.length == 0){
                res.status(402); // no data
                res.send(output);
                return;
            }
            if(req.query.format=='json' || req.query.format==undefined){
                res.send(output);
            }else if(req.query.format=='csv'){
                res.attachment("results.csv").send(output);
            }
    	});
        con.end();
    });
}

router.get('/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to', getPassesAnalysis);
module.exports = router;
