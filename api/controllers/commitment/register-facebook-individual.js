module.exports = {


  friendlyName: 'Register facebook messenger user',

  description: 'Take registration from ChatFuel and create user',

  extendedDescription: '',

  inputs: {
      firstname: {
        description: 'First name of user',
        type: 'string',
        required: true
      },
      lastname: {
        description: 'First name of user',
        type: 'string',
        required: true
      },
      messengeruserid: {
        description: 'Unique ID of messenger user',
        type: 'string',
        required: true
      }

  },

  exits: {

    success: {
      description: 'The user has been created in model.',
      responseType: 'ok'
    }

  },


  fn: async function (inputs, exits) {
	// This call initializes the individual
	// Called from ChatFuel
	// Expecting first name, last name, messenger user id

	// Need to create a new user from this info
	// user = Individual.new(source: source, sourceID: sourceID, firstName: firstName, lastName: lastName, email:email, isHelper: 0, isEntreprenuer: 0)

    await User.create(
    	{
    		firstName: inputs.firstname,
      		lastName: inputs.lastname,
      		messengerUserId: inputs.messengeruserid,
		}
	);

    return exits.success();
  },

};
