const express = require('express');
const router = express.Router();
var mysql = require('mysql');
function CDate_in_rformat(){//returns a timestamp string containing the exact time at the moment of call
  const d = new Date();//The timestamp at the time of call
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
  year_st=req.params.date_from.slice(0,4);
  month_st=req.params.date_from.slice(4,6);
  day_st=req.params.date_from.slice(6);

  //get the date that the resulting passes will end
  year_to=req.params.date_to.slice(0,4);
  month_to=req.params.date_to.slice(4,6);
  day_to=req.params.date_to.slice(6);


  var curr_timestamp=
  con.connect(function(err){
    if(err){
      throw err;
    }
    console.log("Connected to database");
    //use auxilliary query to get information about the station that is necessary
    //for the main query and required to be returned.
    let auxquery="select station_provider from stations where station_id=?";
    let mainquery="with gstation_provider(station_id,station_provider) as (select station_id,station_provider from stations where station_id=?)select ROW_NUMBER() over (order by timestamp) as PassIndex,pass_id as PassID,timestamp as PassTimeStamp,vehicle_ref as Vehicle_ID,tag_provider as TagProvider,if(tag_provider=station_provider,'home','visitor') as PassType,charge as PassCharge from passes join vehicles on passes.vehicle_ref=vehicles.vehicle_id, gstation_provider where  station_ref=station_id and passes.timestamp between ? and ?   order by timestamp;"
    con.query(auxquery,[req.params.stationID],function (err,result,fields){
      if (err) throw err;
      console.log(result[0].station_provider);
      //var auxq_obj=JSON.parse(result);
      //console.log(auxq_obj.station_provider)
      //res.send(result);
      con.query(mainquery,[req.params.stationID,year_st+'-'+month_st+'-'+day_st+' 00:00:00',year_to+'-'+month_to+'-'+day_to+' 23:59:59'],
      function(err,mainresult,fields){
        if (err) throw err;
        res.send(mainresult);
        console.log(mainresult.length);
        console.log(mainresult[0]);
      }
    );
    });
  })
}
router.get('/PassesPerStation/:stationID/:date_from/:date_to',PassesPerStation);
module.exports = router;
