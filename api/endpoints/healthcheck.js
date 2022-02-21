const express = require('express');
const router = express.Router();
const db = require('../config.json');
var mysql = require('mysql');

function healthcheck(req, res) {
    console.log(req.url);

    const cs = db;

    var con = mysql.createConnection({
        host: db.host,
        user: db.user,
        password: db.password,
        database: db.database
    });

    con.connect(function (err) {
        if (err) {
            res.status(500);
            res.send({ "status": "failed", "dbconnection": cs })
        }
        else {
            res.send({ "status": "OK", "dbconnection": cs })
        }
    });
    con.end();
}

router.get('/admin/healthcheck', healthcheck);
module.exports = router;
