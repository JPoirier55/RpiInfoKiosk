var utils = require('./utils.js');
var http = require("http");
var https = require("https")

module.exports = {
  getRecentEpisodes: function (callback) {
  	getRecentEpisodes(callback);
  }
};



function getRecentEpisodes(callback){
	var recentEpsURL = "http://konecny.ddns.net:8082/jsonrpc?request={%22jsonrpc%22:%222.0%22,%22id%22:1,%22method%22:%22VideoLibrary.GetRecentlyAddedEpisodes%22}";

	// utils.downloadFile(recentEpsURL, function(json){
	// 	console.log("CALLBACK!!!!!!!!" + json);		
	// 	callback(json);
	// });

	var options = {
	    host: 'konecny.ddns.net',
	    port: 8082,
	    path: '/jsonrpc?request={"jsonrpc":"2.0","id":1,"method":"VideoLibrary.GetRecentlyAddedEpisodes"}',
	    method: 'GET',
	    headers: {
	        'Content-Type': 'application/json'
	    }
	};

	getUrl(options, function(statusCode, obj){
		console.log(statusCode);
		callback(obj);
	});

}


function getUrl(options, callback){
 	var prot = options.port == 443 ? https : http;
 	console.log(options)
    var req = prot.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            //var obj = JSON.parse(output);
            callback(res.statusCode, output);
        });
    });

    req.on('error', function(err) {
        //res.send('error: ' + err.message);
    });

    req.end();
}