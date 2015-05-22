var http = require('http');

module.exports = {
  downloadFile: function (url, callback) { downloadFile(url, callback);},
  downloadFileWithOptions: function (options, callback) { downloadFile(options, callback);},
};


function downloadFile(url, callback){
	console.log(url);
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
		callback(e);
	});
}


function downloadFileWithOptions(options, callback){
 	var prot = options.port == 443 ? https : http;
 	var req = prot.request(options, function(res)
    {
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
        callback(err.message);
    });

    req.end();
}