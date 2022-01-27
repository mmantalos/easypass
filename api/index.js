const port = 9103;
const baseUrl = "/interoperability/api"
var express = require('express')
var fs = require('fs');
var https = require('https');
//synchronous read of private key and self-signed certificate
var privateKey  = fs.readFileSync('./key.pem', 'utf8');
var certificate = fs.readFileSync('./cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};
var app = express();
//WELCOME FRIENDS

app.get(baseUrl, (req, res) => {
  res.send("HELLO WORLD");
});

// load all endpoints
const healthcheck=require("./endpoints/healthcheck.js");
const resetpasses=require("./endpoints/resetpasses.js");
const resetstations=require("./endpoints/resetstations.js");
const resetvehicles=require("./endpoints/resetvehicles.js");

//main endpoints
const ppStation=require("./endpoints/PassesPerStation.js");
const pAnalysis = require("./endpoints/PassesAnalysis.js");
const pCost=require("./endpoints/passesCost.js");
const ChargesBy = require("./endpoints/ChargesBy.js");
const CommitPass = require("./endpoints/CommitPass.js");


//bind all endpoints to app router
app.use(baseUrl, healthcheck);
app.use(baseUrl, resetpasses);
app.use(baseUrl,resetstations);
app.use(baseUrl,resetvehicles);

app.use(baseUrl, pAnalysis);
app.use(baseUrl, ppStation);
app.use(baseUrl, pCost);
app.use(baseUrl, ChargesBy);

app.use(baseUrl, CommitPass);

https.createServer(
{
  key: fs.readFileSync('./key.pem', 'utf8'),
  cert : fs.readFileSync('./cert.pem', 'utf8'),
}, app).listen(port, () => console.log(`Secure server on port ${port}`));
