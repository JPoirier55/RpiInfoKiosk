var http = require('http');

module.exports = {
  getWeather: function (callback) {
  	getYahooWeather(10014, callback);
  },
  getToolbarWeather: function (callback) {
    getToolbarWeather(10014, callback);
  }
};

function getToolbarWeather(zipcode, callback){
	var forecast = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+zipcode+'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
	downloadFile(forecast, function(jsonStr){
		parseWeatherToolbarJson(jsonStr, callback);
	});
}

function getYahooWeather(zipcode, callback){
	var forecast = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+zipcode+'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys'
	downloadFile(forecast, function(jsonStr){
		parseWeatherToolbarJson(jsonStr, callback);
	});

}

function toolbarObject(imgSrc, currentTemp, location, radarImgs, hum){
	this.img = imgSrc;
	this.currentTemp = currentTemp;
	this.humidity = hum;
	this.location = location;
	this.radar_imgs = radarImgs;
	this.date = new Date();
}

function parseWeatherToolbarJson(json, callback){
	var jsonArr = JSON.parse(json);
	var resultsArr = jsonArr['query']['results']['channel'];
	var currentConditionObj = resultsArr['item']['condition'];
	var locationObj = resultsArr['location'];
	var desc = resultsArr['item']['description'];
	var hum = resultsArr.atmosphere.humidity;
	var rex = /http:.*.gif/g;
	var imgHtml = rex.exec(desc);
	var date = new Date().toISOString();
	var imgs = ["http://images.webcamgalore.com/5943-current-webcam-New-York-City-New-York.jpg?time="+date,"http://cdn.abclocal.go.com/three/wabc/weather/16_9/hd/wabc_a_1_1280.jpg?time="+date];
	callback(new toolbarObject(imgHtml[0], currentConditionObj.temp, locationObj.city +', '+locationObj.region, imgs, hum));
}

function parseWeatherForecastJson(json, callback){
	var jsonArr = JSON.parse(json);
	//console.log("JSON: %j", jsonArr);
	//console.log("REZ: %j" ,jsonArr['query']['results']);
	var resultsArr = jsonArr['query']['results']['channel'];
	var locationObj = resultsArr['location'];
	var currentConditionObj = resultsArr['item']['condition'];
	var desc = resultsArr['item']['description'];
	var forecastObj = resultsArr['item']['forecast'];
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
