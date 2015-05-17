var parseString = require('xml2js').parseString;
var utils = require('./utils.js');
var iconUrl = "http://www.mta.info/sites/all/themes/mta/images/subway_bullets/";

module.exports = {
  getTrainStatus: function (callback) {
  	getTrainStatus(callback);
  }
};


function getTrainStatus(callback){
	var status = 'http://web.mta.info/status/serviceStatus.txt';
	utils.downloadFile(status, function(xmlStr){
		parseString(xmlStr, function (err, result) {
			for(var i=0; i<result.service.subway[0].line.length; i++){
				var name = result.service.subway[0].line[i].name[0];
				if(name != 'SIR'){
					name = name.toLowerCase();
					//Make array for icons
					result.service.subway[0].line[i].name = name.split('');	
				}else{
					temp = ["sir"];
					result.service.subway[0].line[i].name = temp;
				}

				if(result.service.subway[0].line[i].status[0] !== "DELAYS"){
					result.service.subway[0].line[i].text[0] = "";
				}
			}

		    callback(result.service.subway);
		});
	});
}


function getTrainInfo(){

}
