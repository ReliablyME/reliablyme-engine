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
      type: number,
      required: true
    },

    comOffer: {
      description: 'Text of what is being offered.',
      required: true
    },

    entID: {
      description: 'messenger id of entrepreneur.',
      required: true
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Chate message sent',
	  responseType: 'ok'
    }

  },


  fn: async function(inputs, exits) {

    var options = {
		helperName: input.helperName,
		commitmentID: input.comID,
		commitmentOffer: intpu.comOffer.
        chatfuel_token: 'qwYLsCSz8hk4ytd6CPKP4C0oalstMnGdpDjF8YFHPHCieKNc0AfrnjVs91fGuH74',
        chatfuel_block_name:"ReceiveHelperOffer",
        port : 80,
        host : "https://api.chatfuel.com",
        path: '/bots/5a3437b6e4b01f197b941b94/users/'+input.entID+'/send',
        method: 'POST'
    };

    restResponse = await http.request(options);

    consolelog('ReceiveHelperOffer :',restResponse);

  },

};
