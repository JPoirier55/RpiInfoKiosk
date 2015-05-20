var express = require('express');
var weather = require('./weather.js');
var mta = require('./mta.js');
var kodi = require('./kodi.js');
var app = express();
 
app.get('/api/v1/weather', function(req, res) {    
 weather.getToolbarWeather(function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/mta', function(req, res) {    
 mta.getTrainStatus(function(callback){
      res.json(callback);
   });
});

app.get('/api/v1/kodi', function(req, res) {    
 kodi.getRecentEpisodes(function(callback){ 		
      	res.json(callback);
   });
});

app.use(express.static(__dirname + '/html'));
app.listen(8080);