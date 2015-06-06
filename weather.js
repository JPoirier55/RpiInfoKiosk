var http = require('http');
var util = require('util');
//Use util.format
var imgBaseUrl = 'http://l.yimg.com/a/i/us/we/52/%s.gif';
module.exports = {
  getWeather: function (callback) {
  	getYahooWeather(10014, callback);
  },
  getToolbarWeather: function (callback) {
    getToolbarWeather(10014, callback);
  }
};

function getToolbarWeather(zipcode, callback){
	var forecast = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+zipcode+'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
	downloadFile(forecast, function(jsonStr){
		parseWeatherToolbarJson(jsonStr, callback);
	});
}


function getYahooWeather(zipcode, callback){
	var forecast = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+zipcode+'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
	downloadFile(forecast, function(jsonStr){
		parseWeatherToolbarJson(jsonStr, callback);
	});

}

function weatherObject(condition, currentTemp, location, radarImgs, hum, forecast){
	this.condition = condition;
	this.currentTemp = currentTemp;
	this.humidity = hum;
	this.location = location;
	this.radar_imgs = radarImgs;
	this.date = new Date();
	this.forecast = forecast;
}

function parseWeatherToolbarJson(json, callback){
	var jsonArr = JSON.parse(json);
	var resultsArr = jsonArr.query.results.channel;
	var currentConditionObj = resultsArr.item.condition;
	var locationObj = resultsArr.location;
	var desc = resultsArr.item.description;
	var hum = resultsArr.atmosphere.humidity;
	currentConditionObj.code = util.format(imgBaseUrl, currentConditionObj.code);

	var date = new Date().toISOString();
	var imgs = ["http://images.webcamgalore.com/5943-current-webcam-New-York-City-New-York.jpg?time="+date,"http://cdn.abclocal.go.com/three/wabc/weather/16_9/hd/wabc_a_1_1280.jpg?time="+date];
	var forecast = getForecast(resultsArr.item.forecast);

	callback(new weatherObject(currentConditionObj, currentConditionObj.temp, locationObj.city +', '+locationObj.region, imgs, hum, forecast));
}

function getForecast(forecastObj){
	for(var i=0; i<forecastObj.length; i++){
		forecastObj[i].code = util.format(imgBaseUrl, forecastObj[i].code);
	}
	return forecastObj;
}

function parseWeatherForecastJson(json, callback){
	var jsonArr = JSON.parse(json);
	//console.log("JSON: %j", jsonArr);
	//console.log("REZ: %j" ,jsonArr['query']['results']);
	var resultsArr = jsonArr.query.results.channel;
	var locationObj = resultsArr.location;
	var currentConditionObj = resultsArr.item.condition;
	var desc = resultsArr.item.description;
	var forecastObj = resultsArr.item.forecast;
	//console.log("current: %j" , forecastObj);
	var weatherInfo = [locationObj, currentConditionObj, forecastObj, desc];
	callback(weatherInfo);
}

function downloadFile(url, callback){

	http.get(url, function(res) {
	    var body = '';

	    res.on('data', function(chunk) {
	        body += chunk;
	    });

	    res.on('end', function() {
	        callback(body);
	    });
	}).on('error', function(e) {
	      console.log("Got error: ", e);
	});
}
