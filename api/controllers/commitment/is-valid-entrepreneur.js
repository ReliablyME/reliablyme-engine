module.exports = {


  friendlyName: 'Check to see if entrepreneur name exists',

  description: 'Look up an entrepreneur based on name',

  extendedDescription: '',

  inputs: {
      inputName: {
        description: 'Full name of entrepreneur',
        type: 'string',
        required: true
      }

  },

  exits: {

    success: {
      description: 'This is a valid entrepreneur.',
      responseType: 'ok'
    },

    notFound: {
      description: 'Did not find the entrepreneur',
      responseType: 'notFound'
    }

  },


  fn: async function (inputs, exits) {
	// This call initializes the individual
	// Called from ChatFuel
	// Expecting first name, last name, messenger user id

	// Need to create a new user from this info
	// user = Individual.new(source: source, sourceID: sourceID, firstName: firstName, lastName: lastName, email:email, isHelper: 0, isEntreprenuer: 0)

    var entrepreneur = await User.findOne({fullName: inputs.lastname, isEntreprenuer: true});

    if(!entrepreneur) { return exits.notFound(); }

    return exits.success({"set_attributes": {"isValidEntrepreneur": true, "entrepreneurID": entrepreneur.messengerUserId}});
  },

};
