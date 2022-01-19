const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function CommitPass(req,res){
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
    password: "freepasses4all",
    database:"easy_pass"
    });

    //Make database connection and query. Error handling???
    con.connect(function(err) {
    	if (err) throw err;
    	console.log("Connected!");
        // convert input dates from "yyyymmdd" to "yyyy-mm-dd" format
        timestamp = timestamp.slice(0,4)+"-"+timestamp.slice(4,6)+"-"+timestamp.slice(6,8)+" "+timestamp.slice(8,10)+":"+timestamp.slice(10,12)+":"+timestamp.slice(12,14);

    	let myquery = `INSERT INTO passes(pass_id,timestamp,station_ref,vehicle_ref,charge) VALUES ('${req.params["pass_ID"]}','${req.params["timestamp"]}','${req.params["station_ID"]}','${req.params["vehicle_ID"]}',${req.params["euros"]}.${req.params["cents"]});`;
        con.query(myquery, function (err, result, fields){
        		if (err) throw err;
                var output = {
                    pass_ID : req.params["pass_ID"],
                    RequestTimestamp : reqTmstmp,
                    Passtimestamp : req.params["timestamp"],
                    station_ID : req.params["station_ID"],
                    vehicle_ID : req.params["vehicle_ID"],
                    charge : parseFloat(req.params["euros"]+req.params["cents"]),
                    Result : result
                }
        		res.send(output);
        	});
        con.end();
    });
}

router.get('/CommitPass/:pass_ID/:timestamp/:station_ID/:vehicle_ID/:euros.:cents', CommitPass);
module.exports = router;
