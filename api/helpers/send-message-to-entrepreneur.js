var request = require('request');
var http = require('http');
var https = require('https');

module.exports = {


  friendlyName: 'Send message to entrepreneur',


  description: 'Send a message to the entrepreneur in messenger using CHatFuel boardcast API.',


  inputs: {

    helperName: {
      description: 'Full name of person offering help',
      type: 'string',
      required: true
    },

    comID: {
      description: 'id of commitment record',
      type: 'number',
      required: true
    },

    comOffer: {
      description: 'Text of what is being offered.',
      type: 'string',
      required: true
    },

    entID: {
      description: 'messenger id of entrepreneur.',
      type: 'number',
      required: true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Chat message sent',
	  responseType: 'ok'
    }

  },


  fn: async function(inputs, exits) {
	
	var path = '/bots/5a3437b6e4b01f197b941b94/users/'+inputs.entID+'/send'; 
    var options = {
        port : 443,
        host : "api.chatfuel.com",
        path: encodeURI(path),
        method: 'POST',
        headers: {
        	'chatfuel_token': 'qwYLsCSz8hk4ytd6CPKP4C0oalstMnGdpDjF8YFHPHCieKNc0AfrnjVs91fGuH74',
        	'chatfuel_block_name': 'ReceiveHelperOffer',
        	'helperName': encodeURI(inputs.helperName),
        	'commitmentID': inputs.comID,
        	'commitmentOffer': encodeURI(inputs.comOffer),
        }
    };

	console.log('sendMessageToEntrepreneur options=:', options);

    await https.request(options, function(response) {
    	console.log("inside request");
		var responseData = '';
    	response.setEncoding('utf8');
		response.on('data', function(chunk){
  			responseData += chunk;    	
    	});

		response.once('error', function(err){
	  		// Some error handling here, e.g.:
	    	console.log("response.once error");
	  		res.serverError(err);
		});

		response.on('end', function(){
	  		try {
		       // response available as `responseData` in `yourview`
			    res.locals.requestData = JSON.parse(responseData);
	  		} catch (e) {
	  			console.log('Could not parse response from options.hostname: ' + e);
	  		}
	  		res.view('client');
		}); 
	}).end();


    console.log('ReceiveHelperOffer returned');
    return exits.success();
  },

};
