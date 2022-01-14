const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function resetvehicles(req, res) {
    var con = mysql.createConnection({
        host:     "localhost",
        user:     "admin",
        password: "softeng2021",
        database: "easy_pass"
    });

    con.connect(function(err) {
        if (err) {
            console.log("Connection error");
            res.send({"status": "error"});
        }
        else {
            console.log('Connected!');

            let myquery = 'DELETE FROM vehicles;'

            // Initialize Vehicles !!!

            console.log(myquery);
            con.query(myquery, function(err, result, fields) {
                if (err) res.send({"status": "failed"});
                else     res.send({"status": "OK"});
            });
        }
        con.end();
    });
}

router.post('/admin/resetvehicles', resetvehicles);
module.exports = router;
