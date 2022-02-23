const express = require('express');
const router = express.Router();
const db = require('../config.json');
var mysql = require('mysql');

function resetpasses(req, res) {
    console.log(req.url);

    var con = mysql.createConnection({
        host: db.host,
        user: db.user,
        password: db.password,
        database: db.database
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
