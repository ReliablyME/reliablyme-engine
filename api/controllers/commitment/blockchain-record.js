module.exports = {


  friendlyName: 'Save the stauts update in the blockchain',

  description: 'Call the smart contract to save the status change in the blockchain',

  extendedDescription: '',

  inputs: {
      commitmentId: {
        description: 'ID for commitment',
        type: 'string',
        required: true
      }
  },

  exits: {

    success: {
      description: 'The record is saved in the blockchain.',
      responseType: 'ok'
    }

  },


  fn: async function (inputs, exits) {
	// This call sets up the web3 call to ethereum to send the smart contract call transaction
	// The commitment gives us the user and event ids as well as the status id

	console.log("blockchainRecord function called");
	console.log(inputs);
    //await User.update({messengerUserId: inputs.messengeruserid}).set({isHelper: true});
    return exits.success();
  },

};
