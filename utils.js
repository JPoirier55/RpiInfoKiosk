var http = require('http');
var https = require('https');

module.exports = {
  downloadFile: function (url, callback) { downloadFile(url, callback);},
  downloadFileSSL: function (url, callback) { downloadFileSSL(url, callback);},
  downloadFileWithOptions: function (options, callback) { downloadFileWithOptions(options, callback);},
};


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
		callback("");
	});
}

function downloadFileSSL(url, callback){
    https.get(url, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            callback(body);
        });
    }).on('error', function(e) {
        console.log("Got error: ", e);
        callback("");
    });
}

function downloadFileWithOptions(options, callback){
    var port = options.port == 443 ? https : http;
    
 	var req = port.request(options, function(res){
        var body = '';
        res.setEncoding('utf8');

        res.on('data', function(chunk){
            body += chunk;
        });

        res.on('end', function() {           
            callback(body);
        });
    });

    req.on('error', function(err) {
        res.send('error: ' + err.message);
        callback("");
    });

    req.end();
}