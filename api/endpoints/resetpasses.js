const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function resetpasses(req, res) {
    var con = mysql.createConnection({
        host:     "localhost",
        user:     "admin",
        password: "freepasses4all",
        database: "easy_pass"
    });

    con.connect(function(err) {
        if (err) {
            res.status(500);
            console.log("Connection error");
            res.send({"status": "error"});
        }
        else {
            console.log('Connected!');

            let myquery = 'TRUNCATE TABLE passes;'

            console.log(myquery);
            con.query(myquery, function(err, result, fields) {
                if (err) {
                    res.status(500);
                    res.send({"status": "failed"});
                }
                else     
                    res.send({"status": "OK"});
            });
        }
        con.end();
    });
}

router.post('/admin/resetpasses', resetpasses);
module.exports = router;
