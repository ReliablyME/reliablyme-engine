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
    },

    botID: {
      description: 'ChatFuel ID of bot.',
      type: 'string',
      required: true
    },

  },


  fn: async function(inputs, exits) {
    console.log('sendMessageToEntrepreneur inputs=:',inputs);
  	var fullpath='/bots/'+inputs.botID+'/users/'+inputs.entID+'/send?chatfuel_token=mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD&chatfuel_block_name=ReceiveHelperOffer&commitmentID='+inputs.comID+'&helperName='+encodeURI(inputs.helperName)+'&commitmentOffer='+encodeURI(inputs.comOffer);
	  var results = ""; 
	  var path = '/bots/'+inputs.botID+'/users/'+inputs.entID+'/send'; 
    var options = {
        port : 443,
        host : "api.chatfuel.com",
        path: fullpath,
        method: 'POST',
        headers: {
        	'chatfuel_token': 'mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD',
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
		    console.log('ReceiveHelperOffer returned: ', fullresponse);
		}); 
	}).end();


    console.log('ReceiveHelperOffer returned');
    return exits.success("Chat message sent");
  },

};
