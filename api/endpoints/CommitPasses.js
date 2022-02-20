const express = require('express');
const bodyParser = require('body-parser');
const multer  = require('multer');
const spawn = require("child_process").spawn;

const router = express.Router();
const storage = multer.diskStorage({
    destination: './tmp_uploads/',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-';
        cb(null, 'passes.csv');
    }
});
const upload = multer({storage: storage}).single('passes');


function CommitPasses(req, res) {
    upload(req, res, (err) => {
        if(err){
            console.log(err);
            //return something
        }else{
            var output;

            const python = spawn(__dirname + '/../../backend/init_passes.py',
                [__dirname + '/../tmp_uploads/passes.csv', 'False']);
            python.stdout.on('data', function (data) {
                output = data.toString();
            });
            console.log('Python finished');

            python.on('close', (code) => {
                console.log(`child process close all stdio with code ${code}`);
                if (code) {
                    res.status(500);
                    res.send({ 'status': 'failed' });
                    console.log('error:', output);
                }
                else
                    res.send({ 'status': 'OK' });
            });
        }
    });
}

// router.use(express.raw()) // for parsing application/json
// router.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
// router.use(bodyParser.json());

router.post('/admin/CommitPasses/', CommitPasses);
module.exports = router;
