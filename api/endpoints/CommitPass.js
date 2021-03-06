const express = require('express');
const router = express.Router();
var mysql = require('mysql');
const db = require('../config.json');
function CommitPass(req, res) {
    console.log(req.url);

    var con = mysql.createConnection({
        host: db.host,
        user: db.user,
        password: db.password,
        database: db.database
    });

    //Make database connection and query.
    con.connect(function (err) {
        if (err) {
            res.status(500); // internal server error
            res.send({ "status": "failed", "details": "DB connection refused." });
            return;
        }
        let myquery = `INSERT INTO passes(pass_id,timestamp,station_ref,vehicle_ref,charge) VALUES ('${req.params["pass_ID"]}','${req.params["timestamp"]}','${req.params["station_ID"]}','${req.params["vehicle_ID"]}',${req.params["euros"]}.${req.params["cents"]});`;
        con.query(myquery, function (err, result, fields) {
            if (err) {
                res.status(500); // internal server error
                res.send({ "status": "failed", "details": "Query error." });
                return;
            }
            res.send({ 'status': 'OK' });
        });
        con.end();
    });
}

router.post('/CommitPass/:pass_ID/:timestamp/:station_ID/:vehicle_ID/:euros.:cents', CommitPass);
module.exports = router;