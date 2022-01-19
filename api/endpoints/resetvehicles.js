const express = require('express');
const router = express.Router();

var mysql = require('mysql');

const spawn = require("child_process").spawn;

function resetvehicles(req, res) {
    var con = mysql.createConnection({
        host:     "localhost",
        user:     "admin",
        password: "freepasses4all",
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

            console.log(myquery);
            con.query(myquery, function(err, result, fields) {
                if (err) res.send({"delete status": "failed"});
                else {
                    res.send({"delete status": "OK"});
                    const python = spawn('../backend/init_vehicles.py',
                ['../backend/sampledata01/sampledata01_vehicles_100.csv']);
                }
            });
        }
        con.end();
    });
}

router.post('/admin/resetvehicles', resetvehicles);
module.exports = router;
