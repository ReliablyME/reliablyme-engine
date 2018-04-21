/**
 * CommitmentController
 *
 * @description :: Server-side logic for managing commitments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

	registerFacebookIndividual: async function (req, res) {
		// This call initializes the individual
		// Called from ChatFuel
		// Expecting first name, last name, messenger user id

		// Need to create a new user from this info
		// user = Individual.new(source: source, sourceID: sourceID, firstName: firstName, lastName: lastName, email:email, isHelper: 0, isEntreprenuer: 0)
		console.log("Called registerFacebookIndividual", req.allParams());

		await User.create(
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


	SetIndividualAsHelper: async function (req, res) {
		console.log("Called SetIndividualAsHelper", req.allParams());
	    await User.update(
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


	SetIndividualAsEntrepreneur: async function (req, res) {
		console.log("Called SetIndividualAsEntrepreneur", req.allParams());
	    await User.update(
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


	IsValidEntrepreneur: async function (req, res) {
		console.log("Called IsValidEntrepreneur", req.allParams());
		var entrepreneur = await User.find( {where: {fullName: req.param("input name"), isEntreprenuer: true}});
		if(entrepreneur) {
			console.log("Found IsValidEntrepreneur ", entrepreneur[0].fullName);
			return res.ok( {"set_attributes":{"isValidEntrepreneur": "true", "entrepreneurID": entrepreneur[0].messengerUserId}});
		}
		else { 
    		return res.serverError("Entrepreneur not found");
	    };
	},

	CreateCommitment: async function (req, res) {
		console.log("Called CreateCommitment", req.allParams());
		var inArray = req.param("inputDate").split("/");
		var inDate = new Date(inArray[2], inArray[1] - 1, inArray[0]);

		// Make sure person exists
		var helper = await User.find({where: {messengerUserId: req.param("messenger user id")}});

		if(helper) {
			console.log("Found helper", helper[0].fullName);
			// Create the commitment record
			var newCommitment = await Commitment.create(
				{
		    		helper_id: req.param("messenger user id"),
		      		entreprenuer_id: req.param("entrepreneurID"),
		      		commitmentOffer: req.param("commitmentOffer"),
		      		commitmentDueDate: inDate,
		      		commitmentStatus_id: 1
				}
		    ).fetch();

			// Send a message to the entrepreneur about the commitment
			if(newCommitment) {
				console.log("call helper to send message to Entrepreneur");
				// Send help offer to entrepreneur
				await sails.helpers.sendMessageToEntrepreneur.with(
					{
						helperName: helper[0].fullName,
						comID: newCommitment.id,
						comOffer: newCommitment.commitmentOffer,
						entID: newCommitment.entreprenuer_id
					}
				);
				return res.ok({"set_attributes": {"commitmentID": newCommitment.id}});
			}
			else return res.serverError("Commitment not created");
		}
		else 
   			return res.serverError("Commitment helper nout found");
	},

	ViewCommitments: async function (req, res) {
		console.log("Called ViewCommitments", req.allParams());

	    await Commitment.find({helper_id: req.param("messenger user id")}).exec(function(err, items){
	      if(err) return res.ok({records: 0});
	      else {
	        console.log("Found records: ", items.length);
	        return res.json({records: items});
	      }
	    });

	},


	isValidCommitmentDate: async function (req, res) {
		console.log("Called isValidCommitmentDate", req.allParams());
		if(req.param("inputDate")) {
			var inArray = req.param("inputDate").split("/");
			var inDate = new Date(inArray[2], inArray[1] - 1, inArray[0]);
			console.log("Checking isValidCommitmentDate", inDate.getUTCDate(), inArray);
			var today = new Date();
			if(inDate>=today)
				return res.ok({"set_attributes": {"isValidDate": "true"}});
		}
		return res.ok({"set_attributes": {"isValidDate": "false"}});
	},

	PromptCommitmentComplete: async function (req, res) {
		console.log("Called PromptCommitmentComplete", req.allParams());
  		return res.ok();
	},

	AcceptCommitmentOffer: async function (req, res) {
		console.log("Called AcceptCommitmentOffer", req.allParams());
  		return res.ok();

	},
	RejectCommitmentOffer: async function (req, res) {
		console.log("Called RejectCommitmentOffer", req.allParams());
  		return res.ok();

	},

	AcceptCommitmentCompletion: async function (req, res) {
		console.log("Called AcceptCommitmentCompletion", req.allParams());
  		return res.ok();

	},
	RejectCommitmentCompletion: async function (req, res) {
		console.log("Called RejectCommitmentCompletion", req.allParams());
  		return res.ok();

	},

	GetReliabilityRating: async function (req, res) {
		console.log("Called GetReliabilityRating", req.allParams());
  		return res.ok();

	},

};

