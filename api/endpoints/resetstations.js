const express = require('express');
const router = express.Router();
const spawn = require("child_process").spawn;

function resetstations(req, res) {
    var output;

    const python = spawn('../backend/init_stations.py',
        ['../backend/sampledata01/sampledata01_stations.csv']);

    python.stdout.on('data', function (data) {
        output = data.toString();
    });

    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
        if (code) {
            res.send({'status':'error'});
            console.log('error:', output);
        }
        else
            res.send({'status': 'OK'});
    });
}

router.post('/admin/resetstations', resetstations);
module.exports = router;
