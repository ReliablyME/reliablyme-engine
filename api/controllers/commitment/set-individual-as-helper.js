module.exports = {


  friendlyName: 'Set the messenger user as a helper',

  description: 'Look up a user based on messenger id and set them as a helper',

  extendedDescription: '',

  inputs: {
      messengeruserid: {
        description: 'Unique ID of messenger user',
        type: 'string',
        required: true
      }

  },

  exits: {

    success: {
      description: 'The user has been set as a helper.',
      responseType: 'ok'
    }

  },


  fn: async function (inputs, exits) {
	// This call initializes the individual
	// Called from ChatFuel
	// Expecting first name, last name, messenger user id

	// Need to create a new user from this info
	// user = Individual.new(source: source, sourceID: sourceID, firstName: firstName, lastName: lastName, email:email, isHelper: 0, isEntreprenuer: 0)

    await User.update({messengerUserId: inputs.messengeruserid}).set({isHelper: true});
    return exits.success();
  },

};
