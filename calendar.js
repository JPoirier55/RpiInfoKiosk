var utils = require('./utils.js');
var util = require('util');

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

	var url = util.format("https://www.googleapis.com/calendar/v3/calendars/usa__en%40holiday.calendar.google.com/events?key=%s&timeMin=%s&timeMax=%s&singleEvents=%s&orderBy=%s",apiKey,dateISO,endDateISO.toISOString(),"true","startTime");	
	console.log(url);
	utils.downloadFileSSL(url, function(json){
		json = JSON.parse(json);
		addExtras(json, callback);
		
	});
}


function addExtras(json,callback){
	if(json.items.length > 0){
		var splitArr = json.items[0].start.date.split("-");

		if(splitArr[1] !== 10){
			json.items[0].icon = "http://www.geekchamp.com/upload/symbolicons/fun/1f383-halloween.png";
			json.items[0].background = "#FF9800";
			json.items[0].backgroundImage ="";
			json.items[0].textColor = "#000";	

		}else if(splitArr[1] === 11){
			json.items[0].icon = "http://img.brothersoft.com/games/flash/icon/t/thanksgiving-pop-720p-92610-1325408900.png";
			json.items[0].background = "#795548";
			json.items[0].backgroundImage ="";
			json.items[0].textColor = "#FDD835";	

		}else if(splitArr[1] === 12){
			json.items[0].icon = "http://png-5.findicons.com/files/icons/243/winter_holiday/128/xmas_tree.png";
			json.items[0].background = "#8BC34A";
			json.items[0].backgroundImage ="";
			json.items[0].textColor = "#F44336";	

		}else{
			json.items[0].icon = "https://s3.amazonaws.com/media-p.slid.es/uploads/billymeinke/images/75494/icon_calendar_white.png";
			json.items[0].background = "#4CAF50";
			json.items[0].backgroundImage ="";
			json.items[0].textColor = "#fff";				
		}
	}
	callback(json.items);

}
