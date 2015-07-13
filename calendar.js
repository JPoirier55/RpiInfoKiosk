var utils = require('./utils.js');
var util = require('util');
var async = require('async');
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

module.exports = {
  getHolidays: function (callback) {
  	getHolidays(callback);
  }
};


function getHolidays(callback){
	getCalendarJson(callback);
}


var apiKey = "AIzaSyBLGmX9Y1vVcFLtE48hA1tPg-4MMhRpcYU";
function getCalendarJson(callback){
	var dateISO = new Date().toISOString();
	var endDateISO = new Date();
	endDateISO.setDate(endDateISO.getDate() + 30);



	var calendarsJSON = [];
	var calendars = ["usa__en%40holiday.calendar.google.com","konecnyna@gmail.com"]
	async.eachSeries(calendars, function(calendar, callback) {
		var url = util.format("https://www.googleapis.com/calendar/v3/calendars/%s/events?key=%s&timeMin=%s&timeMax=%s&singleEvents=%s&orderBy=%s",calendar, apiKey,dateISO,endDateISO.toISOString(),"true","startTime");	
		utils.downloadFileSSL(url, function(json){
			json = JSON.parse(json);
			calendarsJSON.push(json.items[0]);
			callback();		
		});
		
	}, function(err){				
		addExtras(getClosestEvent(calendarsJSON), callback);
	});
}

function getClosestEvent(calendars){
	if(calendars.length != 2){
		return calendars[0];
	}
	var cal1 = (calendars[0]!==undefined);
	var cal2 = (calendars[1]!==undefined);


	if(cal1 && !cal2){
		return calendars[0];
	}else if(!cal1 && cal2){
		return calendars[1];
	}else if(!cal1 && !cal2){
		return;
	}

	
	var date1 = new Date(calendars[0].start.date);
	var date2 = new Date(calendars[1].start.date);
	if(date1 < date2){
		return calendars[0];
	}else{
		return calendars[1];
	}
}

function addExtras(calendarEvent,callback){
	if(calendarEvent !== undefined){
		var eventDate = new Date(calendarEvent.start.date);
		if(eventDate.getMonth() === 10){
			calendarEvent.icon = "http://www.geekchamp.com/upload/symbolicons/fun/1f383-halloween.png";
			calendarEvent.background = "#FF9800";
			calendarEvent.backgroundImage ="";
			calendarEvent.textColor = "#000";
			calendarEvent.dateColor = "#FFEB3B";	

		}else if(eventDate.getMonth() === 11){
			calendarEvent.icon = "http://img.brothersoft.com/games/flash/icon/t/thanksgiving-pop-720p-92610-1325408900.png";
			calendarEvent.background = "#795548";
			calendarEvent.backgroundImage ="";
			calendarEvent.textColor = "#FDD835";
			calendarEvent.dateColor = "#FF9800";	

		}else if(eventDate.getMonth() === 12){
			calendarEvent.icon = "http://png-5.findicons.com/files/icons/243/winter_holiday/128/xmas_tree.png";
			calendarEvent.background = "#8BC34A";
			calendarEvent.backgroundImage ="";
			calendarEvent.textColor = "#F44336";
			calendarEvent.dateColor = "#F44336";		

		}else{
			calendarEvent.icon = "http://uwahockey.org.au/wp-content/uploads/2015/02/news-icon-100x100.png";
			calendarEvent.background = "#4CAF50";
			calendarEvent.backgroundImage ="";
			calendarEvent.textColor = "#FFFF8D";
			calendarEvent.dateColor = "#FFEB3B";				
		}

		var now = new Date();
		var date1 = new Date(calendarEvent.start.date);
		
		if(date1.getDate() - now.getDate() < 6){
			calendarEvent.start.date = "in " + (date1.getDate() - now.getDate()) + " days."
		}else{
			calendarEvent.start.date = "on " + monthNames[date1.getMonth()] + " " + date1.getDate();
		}

		
	}
	callback(calendarEvent);

}
