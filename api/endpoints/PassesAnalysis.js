const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const j2c= require('json2csv');

function getPassesAnalysis(req,res){
    var date_from = req.params["date_from"];
    var date_to = req.params["date_to"];
    var reqTmstmp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "softeng2021",
    database:"easy_pass"
    });

    //Make database connection and query. Error handling???
    con.connect(function(err) {
    	if (err) throw err;
    	console.log("Connected!");
        date_from = date_from.slice(0,4)+"-"+date_from.slice(4,6)+"-"+date_from.slice(-2);
        date_to = date_to.slice(0,4)+"-"+date_to.slice(4,6)+"-"+date_to.slice(-2);
    	let myquery = `SELECT p.pass_id AS PassID, s.station_id AS StationID, p.timestamp AS TimeStamp, v.vehicle_id AS VehicleID, p.charge AS Charge FROM vehicles AS v, stations AS s, passes AS p WHERE v.vehicle_id = p.vehicle_ref AND s.station_id = p.station_ref AND v.tag_provider = "${req.params["op2_ID"]}" AND s.station_provider = "${req.params["op1_ID"]}" AND CAST(p.timestamp AS date) BETWEEN "${date_from}" AND "${date_to}";`;
        con.query(myquery, function (err, result, fields){
    		if (err) throw err;
            result.forEach((item) => item.TimeStamp = item.TimeStamp.toISOString().replace(/T/, ' ').replace(/\..+/, ''));
            var output = {
                op1_ID : req.params["op1_ID"],
                op2_ID : req.params["op2_ID"],
                RequestTimestamp : reqTmstmp,
                PeriodFrom : date_from,
                PeriodTo : date_to,
                NumberOfPasses : result.length,
                PassesList : result
            }
            // if(req.query.format == 'csv'){
            //     const json2csv = new j2c.Parser({ fields });
            //     conslole.log("HELLO");
            //     const csv = json2csv.parse(result);
            //     console.log(csv);
            //     res.header('content-type', 'text/csv');
            //     res.attachment("res.csv").send(result);
            // }
            res.send(output);
    	});
        con.end();
    });
}

router.get('/PassesAnalysis/:op1_ID/:op2_ID/:date_from/:date_to', getPassesAnalysis);
module.exports = router;
