const express = require('express');
const router = express.Router();

var mysql = require('mysql');

const spawn = require("child_process").spawn;

function resetstations(req, res) {
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

            let myquery = 'DELETE FROM stations;'

            console.log(myquery);
            con.query(myquery, function(err, result, fields) {
                if (err) res.send({"delete status": "failed"});
                else {
                    res.send({"delete status": "OK"});
                    const python = spawn('../backend/init_stations.py',
                ['../backend/sampledata01/sampledata01_stations.csv']);
                }
            });
        }
        con.end();
    });
}

router.post('/admin/resetstations', resetstations);
module.exports = router;
