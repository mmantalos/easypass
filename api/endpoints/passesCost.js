const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function getPassesCost(req,res){

    var date_ob = new Date();
    const date = ("0" + date_ob.getDate()).slice(-2);
    const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    const year = date_ob.getFullYear();
    const hours = ("0" + date_ob.getHours()).slice(-2);
    const minutes = ("0" + date_ob.getMinutes()).slice(-2);
    const seconds = ("0" + date_ob.getSeconds()).slice(-2);
    var reqTmstmp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

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
    	let myquery = `SELECT COUNT(p.pass_id) AS PassesCount, SUM(p.charge) AS PassesCost FROM vehicles AS v, stations AS s, passes AS p WHERE v.vehicle_id = p.vehicle_ref AND s.station_id = p.station_ref AND v.tag_provider = ${req.params["op2_ID"]} AND s.station_provider = ${req.params["op1_ID"]} AND CAST(p.timestamp AS date) BETWEEN ${req.params["date_from"]} AND ${req.params["date_to"]};
        console.log(myquery);
        con.query(myquery, function (err, result, fields){
        		if (err) throw err;
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
