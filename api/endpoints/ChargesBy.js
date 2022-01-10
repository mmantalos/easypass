const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function getChargesBy(req,res){
    var date_ob = new Date();
    const date = ("0" + date_ob.getDate()).slice(-2);
    const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    const year = date_ob.getFullYear();
    const hours = ("0" + date_ob.getHours()).slice(-2);
    const minutes = ("0" + date_ob.getMinutes()).slice(-2);
    const seconds = ("0"+date_ob.getSeconds()).slice(-2);
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
    	let myquery = `SELECT tag_provider as VisitingOperator, COUNT(pass_id) as NumberOfPasses, SUM(charge) as PassesCost FROM stations, vehicles, vehicle_id WHERE station_provider = ${req.params["op_ID"]} AND tag_provider <> ${req.params["op_ID"]} AND timestamp >= ${req.params["date_from"]} AND timestamp <= ${req.params["date_to"]} AND station_ref = station_id AND vehicle_ref = vehicle_id GROUP BY tag_provider;`;
        con.query(myquery, function (err, result, fields){
        		if (err) throw err;
                var output = {
                    op_ID : req.params["op_ID"],
                    RequestTimestamp : reqTmstmp,
                    PeriodFrom : req.params["date_from"],
                    PeriodTo : req.params["date_to"],
                    NumberOfCharges : result.length,
                    PPOList : result
                }
        		res.send(output);
        	});
        con.end();
    });
}

router.get('/ChargesBy/:op_ID/:date_from/:date_to', getChargesBy);
module.exports = router;
