const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer  = require('multer');
const spawn = require("child_process").spawn;
const moment = require('moment');

const router = express.Router();
const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//     destination: './tmp_uploads/',
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-';
//         cb(null, 'passes.csv');
//     }
// });
const upload = multer({storage: storage}).single('passes');


function CommitPasses(req, res) {
    var con = mysql.createConnection({
        host: "localhost",
        user: "admin",
        password: "freepasses4all",
        database: "easy_pass",
        timezone: "eet"
    });

    upload(req, res, (err) => {
        if(err){
            console.log(err);
            //return something
        }else{
            con.connect(function(err){
                if (err) {
                    res.status(500); // internal server error
                    res.send({ status: 'failed', details: 'DB connection refused.' });
                    return;
                }
                csv = req.file.buffer.toString().split('\r\n');
                var error = false;
                for(const element of csv.slice(1)){
                    if(error) break;
                    params = element.split(';')
                    formated_date = moment(params[1]+':00', 'DD/MM/YYYY hh:mm:ss').format('YYYY-MM-DD hh:mm:ss');
                    myquery = 'INSERT INTO passes(pass_id,timestamp,station_ref,vehicle_ref,charge) VALUES (?,?,?,?,?)';
                    con.query(myquery, [params[0], formated_date, params[2], params[3], params[4]], function(err, result, fields){
                        if (err) error = true;
                    });
                }
                if(error){
                    res.status(500); // internal server error
                    res.send({ status: 'failed', details: 'Query error.' });
                }else{
                    res.send({ status: 'OK', details: 'Passes Commited.' });
                }
                con.end();
            });
        }
    });
}

// router.use(express.raw()) // for parsing application/json
// router.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// router.use(bodyParser.json());

router.post('/admin/CommitPasses/', CommitPasses);
module.exports = router;
