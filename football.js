var utils = require('./utils.js');
var util = require('util');
var moment = require('moment');
var apiKey = "ejwqdwezs7xi";
var baseUrl = "http://www.fantasyfootballnerd.com/service/schedule/json/ejwqdwezs7xi";
var path = require('path');


var MIN_DAYS_FOR_GAME = 5;
var ICON_URL = "http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/%s.png&h=100";

fs = require('fs');
teamsDictionary = {  
      "ARI" : {          
         fullName:"Arizona Cardinals",
         shortName:"Arizona"
      },
      "ATL" : {           
         fullName:"Atlanta Falcons",
         shortName:"Atlanta"
      },
      "BAL" : {            
         fullName:"Baltimore Ravens",
         shortName:"Baltimore"
      },
      "BUF" : {          
         fullName:"Buffalo Bills",
         shortName:"Buffalo"
      },
      "CAR" : {          
         fullName:"Carolina Panthers",
         shortName:"Carolina"
      },
      "CHI" : {          
         fullName:"Chicago Bears",
         shortName:"Chicago"
      },
      "CIN" : {           
         fullName:"Cincinnati Bengals",
         shortName:"Cincinnati"
      },
      "CLE" : {           
         fullName:"Cleveland Browns",
         shortName:"Cleveland"
      },
      "DAL" : {           
         fullName:"Dallas Cowboys",
         shortName:"Dallas"
      },
      "DEN" : {           
         fullName:"Denver Broncos",
         shortName:"Denver"
      },
      "DET" : {           
         fullName:"Detroit Lions",
         shortName:"Detroit"
      },
      "GB" : {           
         fullName:"Green Bay Packers",
         shortName:"Green Bay"
      },
      "HOU" : {  
         fullName:"Houston Texans",
         shortName:"Houston"
      },
      "IND" : {  
         fullName:"Indianapolis Colts",
         shortName:"Indianapolis"
      },
      "JAC" : {          
         fullName:"Jacksonville Jaguars",
         shortName:"Jacksonville"
      },
      "KC" : {  
         
         fullName:"Kansas City Chiefs",
         shortName:"Kansas City"
      },
     "MIA" : {        
         fullName:"Miami Dolphins",
         shortName:"Miami"
      },
     "MIN" : {  
         fullName:"Minnesota Vikings",
         shortName:"Minnesota"
      },
      "NYG" :{          
         fullName:"N.Y. Giants",
         shortName:"N.Y. Giants"
      },
      "NYJ" : {           
         fullName:"N.Y. Jets",
         shortName:"N.Y. Jets"
      },
      "NE" : {  
         fullName:"New England Patriots",
         shortName:"New England"
      },
      "NO" : {  
         fullName:"New Orleans Saints",
         shortName:"New Orleans"
      },
      "OAK" : {  
         fullName:"Oakland Raiders",
         shortName:"Oakland"
      },
      "PHI" : {           
         fullName:"Philadelphia Eagles",
         shortName:"Philadelphia"
      },
      "PIT" : {           
         fullName:"Pittsburgh Steelers",
         shortName:"Pittsburgh"
      },
      "SD" : {  
         fullName:"San Diego Chargers",
         shortName:"San Diego"
      },
      "SF" : {  
         fullName:"San Francisco 49ers",
         shortName:"San Francisco"
      },
      "SEA" : {        
         fullName:"Seattle Seahawks",
         shortName:"Seattle"
      },
      "STL" : {  
         fullName:"St. Louis Rams",
         shortName:"St. Louis"
      },
      "TB" : {  
         fullName:"Tampa Bay Buccaneers",
         shortName:"Tampa Bay"
      },
      "TEN" : {           
         fullName:"Tennessee Titans",
         shortName:"Tennessee"
      },
      "WAS" : {           
         fullName:"Washington Redskins",
         shortName:"Washington"
      }  
};



module.exports = {
  getNextPatsGame: function (callback) {
  	getNextPatsGame(callback);
  }
};


function getNextPatsGame(callback){

   var filePath = path.join(__dirname, 'nfl_2015_schedule.json');

   fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
       if (!err){
         var footballSchedule = JSON.parse(data);
         callback(findPatsGame(footballSchedule.Schedule));
       }else{
           console.log(err);
           callback();
       }

   });

	// utils.downloadFile(baseUrl, function(data){
	// 	var footballSchedule = JSON.parse(data);	
	// 	callback(findPatsGame(footballSchedule.Schedule));
	// });
}


function findPatsGame(schedule){
	var today = new moment();   
	for(var i=0; i<schedule.length; i++){
		var homeTeam = schedule[i].homeTeam;
		var awayTeam = schedule[i].awayTeam;

		var gameDate = new moment(schedule[i].gameDate);		
      var daysDiff = gameDate.diff(today, 'days');
      if(daysDiff > 0 && daysDiff < MIN_DAYS_FOR_GAME && (homeTeam === "NE" || awayTeam === "NE")){
			schedule[i].kind = "football";
			schedule[i].awayTeamIcon = util.format(ICON_URL, awayTeam);          
         schedule[i].homeTeamIcon = util.format(ICON_URL, homeTeam);          

			return schedule[i];	
		}			
	}
   return undefined;   
}
