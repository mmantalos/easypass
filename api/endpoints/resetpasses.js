const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function resetpasses(req, res) {
    console.log(req.url);

    var con = mysql.createConnection({
        host: "localhost",
        user: "admin",
        password: "freepasses4all",
        database: "easy_pass"
    });

    con.connect(function (err) {
        if (err) {
            res.status(500);
            res.send({ "status": "failed" });
        }
        else {
            let myquery = 'TRUNCATE TABLE passes;'

            con.query(myquery, function (err, result, fields) {
                if (err) {
                    res.status(500);
                    res.send({ "status": "failed" });
                }
                else
                    res.send({ "status": "OK" });
            });
        }
        con.end();
    });
}

router.post('/admin/resetpasses', resetpasses);
module.exports = router;
