var parseString = require('xml2js').parseString;
var utils = require('./utils.js');
var iconUrl = "http://www.mta.info/sites/all/themes/mta/images/subway_bullets/";

var redLight = "assets/redlight.png";
var yellowLight = "assets/yellowlight.jpg";
var greenLight = "assets/greenlight.jpg";

var ACE_DELAY = false;
var BDFM_DELAY = false;

module.exports = {
  getTrainStatus: function (callback) {
  	getTrainStatus(callback);
  }
};


function getTrainStatus(callback){
	var status = 'http://web.mta.info/status/serviceStatus.txt';
	utils.downloadFile(status, function(xmlStr){
		parseString(xmlStr, function (err, result) {
			if(typeof result === "undefined" || typeof result.service === "undefined"){
				return;
			}
			var delayText = "";
			for(var i=0; i<result.service.subway[0].line.length; i++){
				var subwayLineObj = result.service.subway[0].line[i];
				var name = subwayLineObj.name[0];
				if(name === 'S' || name === 'SIR'){
					//skip stupid subways
					//fix the 2...
					result.service.subway[0].line.splice(i,2);	
					continue;
				}else{
					//name = name.toLowerCase();
					//Make array for icons
					result.service.subway[0].line[i].name = name.split('');						
				}

				var status = result.service.subway[0].line[i].status[0];
				if(status !== "DELAYS"){
					result.service.subway[0].line[i].text[0] = "";
					if(name === "ACE"){
						ACE_DELAY = false;
					}
					if(name === "BDFM"){
						BDFM_DELAY = false;
					}
				}else{
					delayText = delayText + " " + subwayLineObj.text[0];
					if(name === "ACE"){
						ACE_DELAY = true;
					}
					if(name === "BDFM"){
						BDFM_DELAY = true;
					}
				}

				if(status == "DELAYS"){
					result.service.subway[0].line[i].icon = redLight;
				}else if(status == "PLANNED WORK"){
					result.service.subway[0].line[i].icon = yellowLight;
				}else if(status == "GOOD SERVICE"){
					result.service.subway[0].line[i].icon = greenLight;
				}else{
					result.service.subway[0].line[i].icon = yellowLight;
				}

				
				getSubwayColor(name[0], result.service.subway[0].line[i]);
				
			}

			result.service.subway[0].status_text = delayText;
			result.service.subway[0].delays = BDFM_DELAY || ACE_DELAY;
		    callback(result.service.subway);
		});
	});
}


function getSubwayColor(subwayName, subwayObj){
	
	if(subwayName == "1"){
		subwayObj.color = "#F44336";	
	}else if(subwayName == "4"){
		subwayObj.color = "#4CAF50";
	}else if(subwayName == "7"){
		subwayObj.color = "#9C27B0";
	}else if(subwayName == "A"){
		subwayObj.color = "#3F51B5";
	}else if(subwayName == "B"){
		subwayObj.color = "#FF9800";
	}else if(subwayName == "J"){
		subwayObj.color = "#795548";
	}else if(subwayName == "G"){
		subwayObj.color = "#69F0AE";
	}else if(subwayName == "L"){
		subwayObj.color = "grey";
	}else if(subwayName == "N"){
		subwayObj.color = "#FFC107";
	}else if(subwayName == "S"){
		subwayObj.color = "#9E9E9E";
	}else if(subwayName == "S"){
		subwayObj.color = "#0D47A1";
	}


}
