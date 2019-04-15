var request = require('request');
var http = require('http');
var https = require('https');

module.exports = {


  friendlyName: 'Send message to helper of completion accepted',


  description: 'Send a message to the helper in messenger using ChatFuel boardcast API.',


  inputs: {
    helperID: {
      description: 'Messenger ID of helper.',
      type: 'string',
      required: true
    },
    eventName: {
      description: 'Name of event to display.',
      type: 'string',
      required: true
    },

    botID: {
      description: 'ChatFuel ID of bot.',
      type: 'string',
      required: true
    },

    ChatbotBlock: {
      description: 'ChatbotBlock to display.',
      type: 'string',
      required: true
    },

  },




  fn: async function(inputs, exits) {
    console.log('SendCommitmentCompletionAcceptanceToHelper inputs=:',inputs);
  	var fullpath='/bots/'+inputs.botID+'/users/'+inputs.helperID+'/send?chatfuel_token=mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD&chatfuel_block_name=CompletionAccepted&eventName='+encodeURI(inputs.eventName);
	  var results = ""; 
	  var path = '/bots/'+inputs.botID+'/users/'+inputs.helperID+'/send'; 
    var options = {
        port : 443,
        host : "api.chatfuel.com",
        path: fullpath,
        method: 'POST',
        headers: {
        	'chatfuel_token': 'mELtlMAHYqR0BvgEiMq8zVek3uYUK3OJMbtyrdNPTrQB9ndV0fM7lWTFZbM4MZvD',
        	'chatfuel_block_name': inputs.ChatbotBlock,
        	'eventName': encodeURI(inputs.eventName),
        }
    };

	  console.log('SendCommitmentCompletionAcceptanceToHelper options=:', options);

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
		    console.log('SendCommitmentCompletionAcceptanceToHelper returned: ', fullresponse);
		}); 
	}).end();


    console.log('SendCommitmentCompletionAcceptanceToHelper returned');
    return exits.success("Chat message sent");
  },

};
