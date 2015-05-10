var express = require('express');
var weather = require('./weather.js');
var app = express();
 
app.get('/api/v1/weather', function(req, res) {    
 weather.getToolbarWeather(function(callback){
      res.json(callback);
   });
});


app.use(express.static(__dirname + '/html'));
app.listen(8080);