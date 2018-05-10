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
		var entrepreneur = await User.find( {where: {fullName: req.param("inputName"), isEntreprenuer: true}});
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
		var inArray = req.param("inputDate").split("#");
		console.log("Date=", inArray[0], inArray[1] - 1, inArray[2]);
		var inDate = new Date(inArray[0], inArray[1] - 1, inArray[2]);

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
		      		commitmentStatus_id: 1,
		      		event_id: req.param("eventID")
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
   			;return res.serverError("Commitment helper nout found")
	},

	ViewCommitments: async function (req, res) {
		console.log("Called ViewCommitments", req.allParams());

	    await Commitment.find({helper_id: req.param("messenger user id"), commitmentStatus_id: [2,4,6]}).exec(function(err, items){
			if(err) return res.ok({});
			else {
				console.log("Found records: ", items.length);
				// Build up JSON to send back

				var curCommit = 0;
				var blockElement = [];
				while(curCommit<items.length){
					var button = {"type": "show_block", "block_names": ["AttemptToComplete"], "title":items[curCommit].commitmentOffer, "set_attributes": {"commitmentIDToComplete": items[curCommit].commitmentOffer}};
					console.log("Button: ",curCommit, " ", button)
					blockElement += button;
					curCommit++;
				}
				var returnBlocks= {"messages": [ {"attachment": {"payload": {"buttons": JSON.Stringify(blockElement)}}}]};
				console.log("Block returned: ", returnBlocks)
				return res.ok(returnBlocks);
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
		// Update status on commitment to 2 - offerAccepted
		await Commitment.update({id:Number(req.param("commitmentID"))}).set({commitmentStatus_id:2});
		console.log("updated commitmentStatus_id:2");
		// Find entrepreneur record for name
		var entrepreneur = await User.find({where: {messengerUserId: req.param("messenger user id")}});
		console.log("Found entrepreneur", entrepreneur[0].fullName);
		// Message user that offer accepted
		await sails.helpers.sendCommitmentAcceptanceToHelper.with(
			{
				entName: entrepreneur[0].fullName,
				comID: req.param("commitmentID"),
				helperID: req.param("messenger user id"),
			}
		);

  		return res.ok();

	},

	RejectCommitmentOffer: async function (req, res) {
		console.log("Called RejectCommitmentOffer", req.allParams());
		// Update status on commitment to 3 - offerRejected
		await Commitment.update({id:req.param("commitmentID")}).set({commitmentStatus_id:3})
		console.log("updated commitmentStatus_id:3");
		// Find entrepreneur record for name
		var entrepreneur = await User.find({where: {messengerUserId: req.param("messenger user id")}});
		console.log("Found entrepreneur", entrepreneur[0].fullName);
		// Message user that offer accepted
		await sails.helpers.sendCommitmentRejectionToHelper.with(
			{
				entName: entrepreneur[0].fullName,
				comID: req.param("commitmentID"),
				helperID: req.param("messenger user id"),
			}
		);

  		return res.ok();

	},

	AcceptCommitmentCompletion: async function (req, res) {
		console.log("Called AcceptCommitmentCompletion", req.allParams());
		await Commitment.update({id:req.param("commitmentID")}).set({commitmentStatus_id:5})
		console.log("updated commitmentStatus_id:3");

		await sails.helpers.sendCommitmentCompletionAcceptedToHelper.with(
			{
				helperID: req.param("messengeruserid"),
				eventName: req.param("eventName"),
			}
		);

  		return res.ok();

	},
	RejectCommitmentCompletion: async function (req, res) {
		console.log("Called RejectCommitmentCompletion", req.allParams());
  		return res.ok();
	},

	GetReliabilityRating: async function (req, res) {
		console.log("Called GetReliabilityRating", req.allParams());
		var commitmentsCompleteQuery = 'SELECT COUNT(*) AS complete FROM reliablyme.commitment WHERE helper_id=' + req.param("messengeruserid") +' AND commitmentStatus_id=5;';
		var commitmentsQuery = 'SELECT COUNT(*) AS total FROM reliablyme.commitment WHERE helper_id=' + req.param("messengeruserid") + ';';
		var params = [];

		sails.sendNativeQuery(commitmentQuery, params).exec(function(err, commitments) {
			if(!err) {
				sails.sendNativeQuery(commitmentsCompleteQuery, params).exec(function(err, completes) {
					if(!err) {
						console.log("commitments "+commitments);
						console.log("completes "+completes);
						res.ok({"set_attributes": {"Reliabilityrating": 1000, "completedNumCommitments", 1}});
					}
				}
			}
	    });


	},

	CommittmentList: async function (req, res) {
		console.log("Called CommittmentList", req.allParams());
		var commitmentQuery = `
			SELECT 
					commit.id AS commitment_id, 
					volunteer.fullName AS fullName, 
					volunteer.messengerUserId AS messenger_id, 
					comStat.id AS comStat_id, 
					comStat.commitmentStatusName AS statusName, 
					commit.commitmentOffer AS offer, 
					events.eventName as eventName
				FROM reliablyme.commitment AS commit 
				JOIN reliablyme.user AS volunteer ON commit.helper_id=volunteer.messengerUserId 
			    JOIN reliablyme.commitmentstatus AS comStat ON comStat.id=commit.commitmentStatus_id
			    JOIN reliablyme.event AS events ON events.id=commit.event_id
			    ORDER BY comStat.id, fullName; `;
		
		var params = [];

		sails.sendNativeQuery(commitmentQuery, params).exec(function(err, items) {
			if(err) return res.ok({});
			else {
				var convRaw = JSON.parse(JSON.stringify(items));
				console.log("Found commitment records for: ", commitmentQuery, " result:", convRaw.rows);
				// Build up JSON to send back
				return res.json({records: JSON.parse(JSON.stringify(convRaw.rows))});
			}
	    });
	},
};

