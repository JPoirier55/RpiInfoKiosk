var http = require('http');

module.exports = {
  downloadFile: function (url, callback) {
  	downloadFile(url, callback);
  }
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
	});
}