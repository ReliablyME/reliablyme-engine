module.exports = {


  friendlyName: 'register facebook messenger user',

  description: 'Take registration from ChatFuel and create user',

  extendedDescription: '',

  exits: {

    success: {
      description: 'The user has been created in model.'
    },

    redirect: { }

  },


  fn: async function (inputs, exits) {
	// This call initializes the individual
	// Called from ChatFuel
	// Expecting first name, last name, messenger user id

	// Need to create a new user from this info
	// user = Individual.new(source: source, sourceID: sourceID, firstName: firstName, lastName: lastName, email:email, isHelper: 0, isEntreprenuer: 0)

    User.create({
      firstName: req.param('first name'),
      lastName: req.param('last name'),
      messengerUserId: req.param('messenger user id'),
    })
    .exec(cb);
    
    return res.ok('Signup successful!');
  },

};
