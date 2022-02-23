const port = 9103;
const baseUrl = "/interoperability/api"
var express = require('express')
var fs = require('fs');
var https = require('https');
var cors = require('cors')

//synchronous read of private key and self-signed certificate
var privateKey = fs.readFileSync(__dirname + '/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/cert.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var app = express();
//WELCOME FRIENDS

app.use(cors())

app.get(baseUrl, (req, res) => {
  res.send("HELLO WORLD");
});

// load all endpoints
const healthcheck = require(__dirname + "/endpoints/healthcheck.js");
const resetpasses = require(__dirname + "/endpoints/resetpasses.js");
const resetstations = require(__dirname + "/endpoints/resetstations.js");
const resetvehicles = require(__dirname + "/endpoints/resetvehicles.js");

//main endpoints
const ppStation = require(__dirname + "/endpoints/PassesPerStation.js");
const pAnalysis = require(__dirname + "/endpoints/PassesAnalysis.js");
const pCost = require(__dirname + "/endpoints/PassesCost.js");
const ChargesBy = require(__dirname + "/endpoints/ChargesBy.js");
const CommitPass = require(__dirname + "/endpoints/CommitPass.js");
const CommitPasses = require(__dirname + "/endpoints/CommitPasses.js");
const SetSettlement = require(__dirname + "/endpoints/SetSettlement.js")


//bind all endpoints to app router
app.use(baseUrl, healthcheck);
app.use(baseUrl, resetpasses);
app.use(baseUrl, resetstations);
app.use(baseUrl, resetvehicles);

app.use(baseUrl, pAnalysis);
app.use(baseUrl, ppStation);
app.use(baseUrl, pCost);
app.use(baseUrl, ChargesBy);
app.use(baseUrl, CommitPass);
app.use(baseUrl, CommitPasses);
app.use(baseUrl, SetSettlement);

https.createServer(
  {
    key: fs.readFileSync(__dirname + '/key.pem', 'utf8'),
    cert: fs.readFileSync(__dirname + '/cert.pem', 'utf8'),
  }, app).listen(port, () => console.log(`Secure server on port ${port}`));
