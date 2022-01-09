const express = require('express');
const router = express.Router();
var mysql = require('mysql');
// const j2c= require('json2csv');

function getPassesAnalysis(req,res){
    //get date string with format "yyyy-mm-dd hh:mm:ss" from date object
    var date_ob = new Date();
    reqTmstmp = [date_ob.getFullYear(), ("0" + (date_ob.getMonth() + 1)).slice(-2), ("0" + date_ob.getDate()).slice(-2)].join('-') + ' ' + [("0" + date_ob.getHours()).slice(-2), ("0" + date_ob.getMinutes()).slice(-2), ("0" + date_ob.getSeconds()).slice(-2)].join(':');

    var date_from = req.params["date_from"];
    var date_to = req.params["date_to"];

    var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "softeng2021",
    database:"easy_pass",
    timezone: "eet"
    });

    //Make database connection and query. Error handling???
    con.connect(function(err) {
    	if (err) throw err;
    	console.log("Connected!");
        // convert input dates from "yyyymmdd" to "yyyy-mm-dd" format
        date_from = date_from.slice(0,4)+"-"+date_from.slice(4,6)+"-"+date_from.slice(-2);
        date_to = date_to.slice(0,4)+"-"+date_to.slice(4,6)+"-"+date_to.slice(-2);

        let myquery = `SELECT ROW_NUMBER() OVER (ORDER BY TimeStamp) AS PassIndex, p.pass_id AS PassID, s.station_id AS StationID, p.timestamp AS TimeStamp, v.vehicle_id AS VehicleID, p.charge AS Charge FROM vehicles AS v, stations AS s, passes AS p WHERE v.vehicle_id = p.vehicle_ref AND s.station_id = p.station_ref AND v.tag_provider = "${req.params["op2_ID"]}" AND s.station_provider = "${req.params["op1_ID"]}" AND CAST(p.timestamp AS date) BETWEEN "${req.params["date_from"]}" AND "${req.params["date_to"]}";`;
        con.query(myquery, function (err, result, fields){
    		if (err) throw err;
            var output = {
                op1_ID : req.params["op1_ID"],
                op2_ID : req.params["op2_ID"],
                RequestTimestamp : reqTmstmp,
                PeriodFrom : date_from,
                PeriodTo : date_to,
                NumberOfPasses : result.length,
                PassesList : result
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
