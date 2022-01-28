const express = require('express');
const router = express.Router();
const spawn = require("child_process").spawn;

function resetvehicles(req, res) {
    var output;

    const python = spawn(__dirname + '/../../backend/init_vehicles.py',
        [__dirname + '/../../backend/sampledata01/sampledata01_vehicles_100.csv']);

    python.stdout.on('data', function (data) {
        output = data.toString();
    });

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

router.post('/admin/resetvehicles', resetvehicles);
module.exports = router;
