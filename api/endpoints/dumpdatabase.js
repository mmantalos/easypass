const express = require('express');
const router = express.Router();
const db = require('../config.json');
const spawn = require('child_process').spawn;

function dumpdatabase(req, res) {
    console.log(req.url);

    var output = "";

    const child = spawn('mysqldump', 
        ['-u', db.user, '--password='+db.password, '-h', db.host, db.database]);

    child.stdout.on('data', function(data) {
        output += data;
    });

    child.on('close', (code) => {
        if (code) {
            res.status(500);
            res.send({'status': 'failed'});
        }
        else {
            text = {'dump': output};
            res.send(text['dump']);
        }
    });
}

router.get('/admin/dumpdatabase', dumpdatabase);
module.exports = router;
