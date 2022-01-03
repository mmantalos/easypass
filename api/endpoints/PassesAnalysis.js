const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function getPassesAnalysis(req,res){
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
    	let myquery = `SELECT p.pass_id AS PassID, s.station_id AS StationID, p.timestamp AS TimeStamp, v.vehicle_id AS VehicleID, p.charge AS Charge FROM vehicles AS v, stations AS s, passes AS p WHERE v.vehicle_id = p.vehicle_ref AND s.station_id = p.station_ref AND v.tag_provider = ${req.params["op2_ID"]} AND s.station_provider = ${req.params["op1_ID"]};`;
        console.log(myquery);
        con.query(myquery, function (err, result, fields){
        		if (err) throw err;
        		res.send(result);
        	});
        con.end();
    });
}

router.get('/PassesAnalysis/:op1_ID/:op2_ID/',getPassesAnalysis);
module.exports = router;
