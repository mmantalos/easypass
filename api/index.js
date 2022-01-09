const express = require('express')
const app = express();
const port = 8000;
const baseUrl = "/interoperability/api"
// var path = require('path');

//initialize port for node application to run
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

//WELCOME FRIENDS

app.get(baseUrl, (req, res) => {
  res.send("HELLO WORLD");
});

// load all endpoints
const healthcheck=require("./endpoints/healthcheck.js");
const resetpasses=require("./endpoints/resetpasses.js");
// const resetstations=require("./endpoints/resetstations.js");
// const resetvehicles=require("./endpoints/resetvehicles.js");
const ppStation=require("./endpoints/PassesPerStation.js");
const pAnalysis = require("./endpoints/PassesAnalysis.js");

//bind all endpoints to app router
app.use(baseUrl, healthcheck);
app.use(baseUrl, resetpasses);
app.use(baseUrl, ppStation);
// app.use(baseUrl,resetstations);
// app.use(baseUrl,resetvehicles);

app.use(baseUrl, pAnalysis);
