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
	
	var path = '/bots/5a3437b6e4b01f197b941b94/users/'+inputs.entID+'/send?chatfuel_token=qwYLsCSz8hk4ytd6CPKP4C0oalstMnGdpDjF8YFHPHCieKNc0AfrnjVs91fGuH74'; 
	path += '&chatfuel_block_name=ReceiveHelperOffer&helperName='+inputs.helperName+'&commitmentID='+inputs.comID+'&commitmentOffer='+inputs.comOffer;
	console.log('sendMessageToEntrepreneur path=:', path);
    var options = {
        chatfuel_token: 'qwYLsCSz8hk4ytd6CPKP4C0oalstMnGdpDjF8YFHPHCieKNc0AfrnjVs91fGuH74',
        chatfuel_block_name:"ReceiveHelperOffer",
        port : 443,
        host : "api.chatfuel.com",
        path: encodeURI(path),
        method: 'POST'
    };

    var restResponse = await https.request(options);

    console.log('ReceiveHelperOffer returned');

    return exits.success();
  },

};
