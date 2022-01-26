const express=require('express');
const router=express.Router();
var moment=require('moment');
var mysql=require('mysql');
function CDate_in_rformat(){//returns a timestamp string containing the exact time at the moment of call
  const d = new Date();//The timestamp at the time of call
  console.log(String(d));
  var dd=String(d.getDate()).padStart(2,'0');//get the days
  var mm= String(d.getMonth()+1).padStart(2,'0');//months
  var yyyy=d.getFullYear();//years.
  var h=String(d.getHours()).padStart(2,'0');//hours
  var m=String(d.getMinutes()).padStart(2,'0');
  var s=String(d.getSeconds()).padStart(2,'0');
  return yyyy+'-'+mm+'-'+dd+' '+h+':'+m+':'+s;
}
function PassesPerStation(req,res){
  console.log("got in the function")
  var con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "freepasses4all",
    database: "easy_pass",
    timezone: 'eet'
  });



  //get the date from which the resulting passes will start
  //and check if it is in the right format
  console.log(req.params.date_from);
  if(!moment(req.params.date_from,'YYYYMMDD',true).isValid()){
    console.log("here");
    res.status(400);
    res.send('Please, give valid dates with format YYYYMMDD.');
    return;
  }
  year_fr=req.params.date_from.slice(0,4);
  month_fr=req.params.date_from.slice(4,6);
  day_fr=req.params.date_from.slice(6);
  date_fr=year_fr+'-'+month_fr+'-'+day_fr+' 00:00:00';
  date_fr=moment(req.params.date_from,'YYYYMMDD').format('YYYY-MM-DD');
  //get the date that the resulting passes will end

  if(!moment(req.params.date_to,'YYYYMMDD',true).isValid()){
    res.status(400);
    res.send('Please, give valid dates with format YYYYMMDD');
    return;
  }
  year_to=req.params.date_to.slice(0,4);
  month_to=req.params.date_to.slice(4,6);
  day_to=req.params.date_to.slice(6);
  date_to=year_to+'-'+month_to+'-'+day_to+' 23:59:59';
  date_to=moment(req.params.date_to, 'YYYYMMDD').format('YYYY-MM-DD');

  var curr_timestamp=moment(new Date()).format('YYYY-MM-DD hh:mm:ss')
  console.log(curr_timestamp);
  con.connect(function(err){
    if(err){
      throw err;
    }
    console.log("Connected to database");


    //use auxilliary query to get the provider of the station.
    let auxquery="select station_provider from stations where station_id=?";

    //use the main query to get the passes requested.
    let mainquery="with gstation_provider(station_id,station_provider) as (select station_id,station_provider from stations where station_id=?)select ROW_NUMBER() over (order by timestamp) as PassIndex,pass_id as PassID,timestamp as PassTimeStamp,vehicle_ref as Vehicle_ID,tag_provider as TagProvider,if(tag_provider=station_provider,'home','visitor') as PassType,charge as PassCharge from passes join vehicles on passes.vehicle_ref=vehicles.vehicle_id, gstation_provider where  station_ref=station_id and passes.timestamp between ? and ? order by timestamp;"
    con.query(auxquery,[req.params.stationID],function (err,result,fields){
      if (err){
        res.status(500);
        res.send("DB connection refused");
        return;
      }
      StationOperator=result[0].station_provider;//query has only one result which is the operator that this station belongs to

      //Perform the main query to get the list of passes.
      con.query(mainquery,[req.params.stationID,date_fr,date_to],
      function(err,mainresult,fields){
        if (err){
          res.status(500);
          res.send("DB connection refused");
        }
        console.log(mainresult.length);
        if (mainresult.length==0){
          res.status(402);
        }
        if(req.query.format=='json' || req.query.format==undefined){
            output={
              "Station":req.params.stationID,
              "StationOperator":StationOperator,
              "RequestTimestamp":curr_timestamp,
              "PeriodFrom":date_fr,
              "PeriodTo":date_to,
              "NumberOfPasses":mainresult.length,
              "PassesList":mainresult
            }
            res.send(output);//change later to contain the results of auxquery
        }
        else if(req.query.format=='csv'){
            //if the required format is csv we need to convert the array of json mainresult to a csv string
            let converter=require('json-2-csv');
            converter.json2csv(mainresult,
              function(err,csv){
                if (err) throw err;
                res.attachment("PassesPerStation.csv").send(csv);
            },{"delimiter":{"field":';'}} );
        }
        //the requested format is neither csv nor json.
        else{
            res.status(400);
            res.send("Sorry, the requested format is not supported");
        }
      }
    );
    });
  })
}
router.get('/PassesPerStation/:stationID/:date_from/:date_to',PassesPerStation);
module.exports = router;
