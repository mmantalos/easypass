const express = require('express');
const router = express.Router();
var mysql = require('mysql');

function resetpasses(req, res) {
    var con = mysql.createConnection({
        host:     "localhost",
        user:     "admin",
        password: "softeng2021",
        database: "easy_pass"
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log('Connected!');

        let myquery = 'TRUNCATE TABLE passes'

        console.log(myquery);
        con.query(myquery, function(err, result, fields) {
            if (err) throw err;
            res.send(result);
        });
        con.end();
    });
}

router.post('/admin/resetpasses', resetpasses);
module.exports = router;
