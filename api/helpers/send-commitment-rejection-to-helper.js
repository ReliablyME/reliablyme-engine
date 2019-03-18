var request = require('request');
var http = require('http');
var https = require('https');

module.exports = {


  friendlyName: 'Send message to helper of acceptance',


  description: 'Send a message to the helper in messenger using ChatFuel boardcast API.',


  inputs: {
    entName: {
      description: 'Full name of entrepreneur',
      type: 'string',
      required: true
    },

    comID: {
      description: 'id of commitment record',
      type: 'number',
      required: true
    },

    helperID: {
      description: 'Messenger ID of helper.',
      type: 'string',
      required: true
    },

    botID: {
      description: 'ChatFuel ID of bot.',
      type: 'string',
      required: true
    },

  },


  fn: async function(inputs, exits) {
  	var fullpath='/bots/'+inputs.botID+'/users/'+inputs.helperID+'/send?chatfuel_token=qwYLsCSz8hk4ytd6CPKP4C0oalstMnGdpDjF8YFHPHCieKNc0AfrnjVs91fGuH74&chatfuel_block_name=CommitmentOfferRejected&commitmentID='+inputs.comID+'&entrepreneurName='+encodeURI(inputs.entName);
	var results = ""; 
	var path = '/bots/'+inputs.botID+'/users/'+inputs.helperID+'/send'; 
    var options = {
        port : 443,
        host : "api.chatfuel.com",
        path: fullpath,
        method: 'POST',
        headers: {
        	'chatfuel_token': 'qwYLsCSz8hk4ytd6CPKP4C0oalstMnGdpDjF8YFHPHCieKNc0AfrnjVs91fGuH74',
        	'chatfuel_block_name': 'ReceiveHelperOffer',
        	'helperName': encodeURI(inputs.helperName),
        	'commitmentID': inputs.comID,
        	'commitmentOffer': encodeURI(inputs.comOffer),
        }
    };

	console.log('SendCommitmentRejectionToHelper options=:', options);

    await https.request(options, function(response) {
    	console.log("inside request");
		var responseData = '';
		var fullresponse = '';
    	response.setEncoding('utf8');
		response.on('data', function(chunk){
  			responseData += chunk;    	
    	});

		response.once('error', function(err){
	  		// Some error handling here, e.g.:
	    	console.log("response.once error", err);
	  		//res.serverError(err);
		});

		response.on('end', function(){
	  		try {
		       // response available as `responseData` in `yourview`
			    fullresponse = JSON.parse(responseData);
	  		} catch (e) {
	  			console.log('Could not parse response from options.hostname: ' + e);
	  		}
		    console.log('CommitmentOfferRejected returned: ', fullresponse);
		}); 
	}).end();


    console.log('CommitmentOfferAccepted returned');
    return exits.success("Chat message sent");
  },

};
