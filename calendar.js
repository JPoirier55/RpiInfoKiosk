var utils = require('./utils.js');
var util = require('util');
var async = require('async');
var moment = require('moment');
var mapsApiKey = "AIzaSyCSEX5yOHaHY6-PqplgRG6SEp5tC8wUzko";
var calApiKey = "AIzaSyBLGmX9Y1vVcFLtE48hA1tPg-4MMhRpcYU";
var mapSrc = "https://www.google.com/maps/embed/v1/place?key=%s&q=%s";


module.exports = {
  getHolidays: function (callback) {
  	getHolidays(callback);
  }
};


function getHolidays(callback){
	getCalendarJson(callback);
}


function getCalendarJson(callback){
	var dateISO = new Date().toISOString();
	var daysOut = 14;

	var calendarsJSON = [];
	var calendars = ["usa__en%40holiday.calendar.google.com","konecnyna@gmail.com"];

	async.eachSeries(calendars, function(calendar, callback) {
		var endDateISO = new Date();
		var days = calendar.indexOf("konecny") ? daysOut : 3;
		endDateISO.setDate(endDateISO.getDate() + days);

		var url = util.format("https://www.googleapis.com/calendar/v3/calendars/%s/events?key=%s&timeMin=%s&timeMax=%s&singleEvents=%s&orderBy=%s",calendar, calApiKey,dateISO,endDateISO.toISOString(),"true","startTime");
		utils.downloadFileSSL(url, function(json){
			json = JSON.parse(json);
			if(json.items.length > 0){
				calendarsJSON.push(json.items[0]);
			}
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
		var now = moment();
		var date1;
		if(calendarEvent.creator.email === "usa__en@holiday.calendar.google.com"){
			date1 = new moment(calendarEvent.start.date);
		}else{
 			date1 = new moment(calendarEvent.start.dateTime);
		}
		var currentMonth = date1.month()+1;

		if(currentMonth === 10){
			calendarEvent.icon = "assets/halloween.png";
			calendarEvent.background = "#FF9800";
			calendarEvent.backgroundImage ="";
			calendarEvent.textColor = "#000";
			calendarEvent.dateColor = "#FFEB3B";

		}else if(currentMonth === 11){
			calendarEvent.icon = "http://img.brothersoft.com/games/flash/icon/t/thanksgiving-pop-720p-92610-1325408900.png";
			calendarEvent.background = "#795548";
			calendarEvent.backgroundImage ="";
			calendarEvent.textColor = "#FDD835";
			calendarEvent.dateColor = "#FF9800";

		}else if(currentMonth === 12){
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

		var diff = date1.diff(now, 'days');
		var diffHours = date1.diff(now, 'hours');
		var isHolidayCal = calendarEvent.creator.email === "usa__en@holiday.calendar.google.com";

		if(diff > 2 && diff <= 7){
			calendarEvent.start.date = "in " + (date1.diff(now, 'days') + 1) + " days.";
		}else if(diff === 0){
			if(diffHours <= 12){
				if(isHolidayCal){
					calendarEvent.summary = calendarEvent.summary.replace('(regional holiday)','');
					calendarEvent.start.date = "Today!";
				}else{
					calendarEvent.start.date = "Today! at: " + date1.format('hh:mm a');
				}
			}else{
				calendarEvent.start.date = "Tommorrow";
			}
		}else{
			calendarEvent.start.date = "on " + date1.format("ddd, MMM DD") + ".";
		}

		if(calendarEvent.location){
			var loc = calendarEvent.location.replace(/, /g, '');
			loc = loc.replace(/ /g, '+');
			calendarEvent.map_src = util.format(mapSrc, mapsApiKey, loc);
		}

		if(isHolidayCal){
			getGoolgeImageResult(calendarEvent, function(){
				callback(calendarEvent);
			});
		}else{
			callback(calendarEvent);
		}

	}else{
		callback(calendarEvent);
	}


}

function getGoolgeImageResult(calendarEvent, callback){
	var googleImgApiUrl = "https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=%s%s";
	googleImgApiUrl = util.format(googleImgApiUrl, calendarEvent.summary, " holiday image");
	utils.downloadFileSSL(googleImgApiUrl, function(json){
		json = JSON.parse(json);
		if(json.responseData){
			var randomIndex = Math.floor((Math.random() * json.responseData.results.length));
			if(randomIndex){
				calendarEvent.img_url = json.responseData.results[randomIndex].url;
			}else{
				calendarEvent.img_url = json.responseData.results[0].url;
			}
		}
		callback();
	});
}
