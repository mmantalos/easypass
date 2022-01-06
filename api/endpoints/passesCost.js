const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function getPassesCost(req,res){

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
    	let myquery = `SELECT COUNT(p.pass_id) AS PassesCount, SUM(p.charge) AS PassesCost FROM vehicles AS v, stations AS s, passes AS p WHERE v.vehicle_id = p.vehicle_ref AND s.station_id = p.station_ref AND v.tag_provider = ${req.params["op2_ID"]} AND s.station_provider = ${req.params["op1_ID"]} AND CAST(p.timestamp AS date) BETWEEN ${req.params["date_from"]} AND ${req.params["date_to"]};
        console.log(myquery);
        con.query(myquery, function (err, result, fields){
        	     if (err) throw err;
            result.forEach((item) => item.TimeStamp = item.TimeStamp.toISOString().replace(/T/, ' ').replace(/\..+/, ''));
            var output = {
                    op1_ID : req.params["op1_ID"],
                    op2_ID : req.params["op2_ID"],
                    RequestTimestamp : reqTmstmp,
                    PeriodFrom : req.params["date_from"],
                    PeriodTo : req.params["date_to"],
                    NumberOfPasses : result.PassesCount,
                    PassesCost : result.PassesCost
                  }
        		res.send(output);
        	});
        con.end();
    });
}

router.get('/PassesCost/:op1_ID/:op2_ID/:date_from/:date_to',getPassesCost);
module.exports = router;
