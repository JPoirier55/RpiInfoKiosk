var http = require('http');
var util = require('util');
var moment = require('moment');
var utils = require('./utils.js');
//Use util.format
var imgBaseUrl = 'http://l.yimg.com/a/i/us/we/52/%s.gif';
module.exports = {
  getYahooWeather: function (callback) {
  	getYahooWeather(10014, callback);
  },
  getForecastIOWeather: function (callback) {
    getForecastIOWeather(callback);
  }
};



function getForecastIOWeather(callback){
	var forecast = 'https://api.forecast.io/forecast/ab4397914a446e55d16d43db59026d56/40.733860,-74.004998';
	utils.downloadFileSSL(forecast, function(jsonStr){
		callback(formatForecastIOData(JSON.parse(jsonStr)));
	});
}


function formatForecastIOData(data){
	data.currently.humidity = data.currently.humidity * 100;
	data.currently.imgs = ["http://images.webcamgalore.com/5943-current-webcam-New-York-City-New-York.jpg?time=" + new Date(),"http://images.intellicast.com/WxImages/RadarLoop/hfd_None_anim.gif"];
	

	for(var i=0; i<data.daily.data.length; i++){
		var currentItem = data.daily.data[i];
		currentItem.time = moment(currentItem.time*1000).format('ddd');
		currentItem.temperatureMax = Math.round(currentItem.temperatureMax);
		currentItem.temperatureMin = Math.round(currentItem.temperatureMin);

		if(i === 0){
			data.currently.sunriseTime = moment(currentItem.sunriseTime*1000).format('hh:mm a');
			data.currently.sunsetTime = moment(currentItem.sunsetTime*1000).format('hh:mm a');
		}
	}
	return data;
}












//YAHOO.


function getYahooWeather(zipcode, callback){
	var forecast = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+zipcode+'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
	downloadFile(forecast, function(jsonStr){
		parseWeatherToolbarJson(jsonStr, callback);
	});
}

function weatherObject(condition, currentTemp, location, radarImgs, hum, forecast,astronomy, wind){
	this.condition = condition;
	this.currentTemp = currentTemp;
	this.humidity = hum;
	this.location = location;
	this.radar_imgs = radarImgs;
	this.date = new Date();
	this.forecast = forecast;
	this.astronomy = astronomy;
	this.wind = wind;
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
	//
	//"http://cdn.abclocal.go.com/three/wabc/weather/16_9/hd/wabc_a_1_1280.jpg?time="+date
	var imgs = ["http://images.webcamgalore.com/5943-current-webcam-New-York-City-New-York.jpg?time="+date,"http://images.intellicast.com/WxImages/RadarLoop/hfd_None_anim.gif"];
	var forecast = getForecast(resultsArr.item.forecast);

	callback(new weatherObject(currentConditionObj, currentConditionObj.temp, locationObj.city +', '+locationObj.region, imgs, hum, forecast, resultsArr.astronomy, resultsArr.wind));
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
