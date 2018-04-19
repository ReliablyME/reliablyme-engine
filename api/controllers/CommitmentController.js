/**
 * CommitmentController
 *
 * @description :: Server-side logic for managing commitments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

	registerFacebookIndividual: function (req, res) {
		// This call initializes the individual
		// Called from ChatFuel
		// Expecting first name, last name, messenger user id

		// Need to create a new user from this info
		// user = Individual.new(source: source, sourceID: sourceID, firstName: firstName, lastName: lastName, email:email, isHelper: 0, isEntreprenuer: 0)
		console.log("Called registerFacebookIndividual", req.allParams());
		/*
	    var newuser = await User.create(
	    	{
	    		firstName: req.param("first name"),
	      		lastName: req.param("last name"),
	      		fullName: req.param("first name") + " " + req.param("last name"),
	      		messengerUserId: req.param("messenger user id"),
			}
		);
		*/

		User.create(
			{
	    		firstName: req.param("first name"),
	      		lastName: req.param("last name"),
	      		fullName: req.param("first name") + " " + req.param("last name"),
	      		messengerUserId: req.param("messenger user id"),
			}, function (err, user) {
	    		return res.ok('Pass');
	    	}
	    );
	},
};

