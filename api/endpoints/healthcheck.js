const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function healthcheck(req,res){
    console.log("GOT IN");
    const cs = "host:localhost;user:admin;password:softeng2021;database:easy_pass";

	  var con = mysql.createConnection({
		host: "localhost",
		user: "admin",
		password: "softeng2021",
		database:"easy_pass"
	  });

	con.connect(function(err) {
      if (err) {
          console.log("error");
          res.send({"status":"failed", "dbconnection": cs})
      }
      else {
          console.log("success");
          res.send({"status":"OK", "dbconnection": cs})
      }
	});
    con.end();
}

router.get('/admin/healthcheck', healthcheck);
module.exports = router;
