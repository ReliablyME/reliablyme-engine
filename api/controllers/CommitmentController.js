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


	SetIndividualAsHelper: function (req, res) {
		console.log("Called SetIndividualAsHelper", req.allParams());
	    User.update(
	    	{
	    		messengerUserId: req.param("messenger user id")
	    	}
	    ).set(
	    	{
	    		isHelper: true
	    	}
	    ), function (err, user) {
	    	if(!err) return res.ok();
	    	else return res.serverError("Individual not found");
	    };

	},


	SetIndividualAsEntrepreneur: function (req, res) {
		console.log("Called SetIndividualAsEntrepreneur", req.allParams());
	    User.update(
	    	{
	    		messengerUserId: req.param("messenger user id")
	    	}
	    ).set(
	    	{
	    		isEntreprenuer: true
	    	}
	    ), function (err, user) {
	    	if(!err) return res.ok();
	    	else return res.serverError("Entrepreneur not found");
	    };
	},


	IsValidEntrepreneur: function (req, res) {
		console.log("Called IsValidEntrepreneur", req.allParams());
		User.findOne(
			{
				fullName: req.param("input name")
			}
			), function (err, user) {
	    		if(!err) return res.ok( 
	    			{
	    				"set_attributes": {"isValidEntrepreneur": "#"+User.isEntreprenuer, "entrepreneurID": "#"+ User.id}
	    			}
	    		);
	    		else return res.serverError("Entrepreneur not found");
	    };
	},

	CreateCommitment: function (req, res) {
		console.log("Called CreateCommitment", req.allParams());
		//com = Commitment.new(helper_id: ind.id, entreprenuer_id: entrepreneurID, commitmentOffer: commitmentOffer, commitmentDueDate: inputDate, commitmentStatus_id: cs.id)
		User.create(
			{
	    		helper_id: req.param("messenger id"),
	      		entreprenuer_id: req.param("entrepreneur id"),
	      		commitmentOffer: req.param("commitment offer"),
	      		commitmentDueDate: Date(req.param("input date")),
	      		commitmentStatus_id: 1
			}, function (err, user) {
	    		return res.ok('Pass');
	    	}
	    );

	},

	ViewCommitments: function (req, res) {
		console.log("Called ViewCommitments", req.allParams());

	    Commitment.find({helper_id: req.param("messenger user id")}).exec(function(err, items){
	      if(err) return res.ok({records: 0});
	      else {
	        console.log("Found records: ", items.length);
	        return res.json({records: items});
	      }
	    });

	},


	isValidCommitmentDate: function (req, res) {
		console.log("Called isValidCommitmentDate", req.allParams());
		if(Date(req.param("input date"))>Now())
			return res.ok({"set_attributes": {"isValidDate": "#true"}});
		else
			return res.ok({"set_attributes": {"isValidDate": "#false"}});
	},

	PromptCommitmentComplete: function (req, res) {
		console.log("Called PromptCommitmentComplete", req.allParams());
  		return res.ok();
	},

	AcceptCommitmentOffer: function (req, res) {
		console.log("Called AcceptCommitmentOffer", req.allParams());
  		return res.ok();

	},
	RejectCommitmentOffer: function (req, res) {
		console.log("Called RejectCommitmentOffer", req.allParams());
  		return res.ok();

	},

	AcceptCommitmentCompletion: function (req, res) {
		console.log("Called AcceptCommitmentCompletion", req.allParams());
  		return res.ok();

	},
	RejectCommitmentCompletion: function (req, res) {
		console.log("Called RejectCommitmentCompletion", req.allParams());
  		return res.ok();

	},

	GetReliabilityRating: function (req, res) {
		console.log("Called GetReliabilityRating", req.allParams());
  		return res.ok();

	},

};

