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
				console.log("Returning from registerFacebookIndividual");
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
	    ), function (err) {
			console.log("Returning from SetIndividualAsHelper");
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

	CheckRegistrationStatus: async function (req, res) {
		console.log("Called CheckRegistrationStatus", req.allParams());
	    await Commitment.find({helper_id: req.param("messenger user id"), event_id: req.param("eventID")}).exec(function(err, items){
			console.log("Returning from CheckRegistrationStatus");
			if(err) return res.ok({"set_attributes":{"IsRegistered": "false"}});
			else {
				console.log("Found records: ", items.length);
				if(items.length>0) return res.ok({"set_attributes":{"IsRegistered": "true"}});
				else return res.ok({"set_attributes":{"IsRegistered": "false"}});
			}
	    });
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
		      		commitmentStatus_id: 2,
		      		event_id: req.param("eventID")
				}
		    ).fetch();

			var event = await Event.find({where: {id: req.param("eventID")}});


			// Send a message to the entrepreneur about the commitment
			if(newCommitment) {
				console.log("call helper to send message to Entrepreneur");
				// Send help offer to entrepreneur
				await sails.helpers.sendMessageToEntrepreneur.with(
					{
						helperName: helper[0].fullName,
						comID: newCommitment.id,
						comOffer: newCommitment.commitmentOffer,
						entID: newCommitment.entreprenuer_id,
						botID: event[0].botID,
					}
				);

				// Record into blockchain
				await sails.helpers.sendTransactionToBlockchain.with(
					{
						commitmentID: newCommitment.id,
						statusID: 2,
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
		var event = await Event.find({where: {id: req.param("eventID")}});
		console.log("Found entrepreneur", entrepreneur[0].fullName);

		// Message user that offer accepted
		await sails.helpers.sendCommitmentAcceptanceToHelper.with(
			{
				entName: entrepreneur[0].fullName,
				comID: req.param("commitmentID"),
				helperID: req.param("messenger user id"),
				botID: event.botID,
			}
		);

		// Record into blockchain
		await sails.helpers.sendTransactionToBlockchain.with(
			{
				commitmentID: req.param("commitmentID"),
				statusID: 2,
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
		var event = await Event.find({where: {id: req.param("eventID")}});
		console.log("Found entrepreneur", entrepreneur[0].fullName);
		// Message user that offer accepted
		await sails.helpers.sendCommitmentRejectionToHelper.with(
			{
				entName: entrepreneur[0].fullName,
				comID: req.param("commitmentID"),
				helperID: req.param("messenger user id"),
				botID: event.botID,
			}
		);

  		return res.ok();

	},

	AcceptCommitmentCompletion: async function (req, res) {
		console.log("Called AcceptCommitmentCompletion", req.allParams());
		await Commitment.update({id:req.param("commitmentID")}).set({commitmentStatus_id:5});
		var commitment = await Commitment.find({where: {id:req.param("commitmentID")}});
		var event = await Event.find({where: {id:commitment[0].event_id}});
		console.log("updated commitmentStatus_id:3");

		// Send back through ChatFuel
		await sails.helpers.sendCommitmentCompletionAcceptedToHelper.with(
			{
				helperID: req.param("messengeruserid"),
				eventName: req.param("eventName"),
				botID: event[0].botID,
			}
		);

		// Record into blockchain
		await sails.helpers.sendTransactionToBlockchain.with(
			{
				commitmentID: req.param("commitmentID"),
				statusID: 5,
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
		var commitmentsCompleteQuery = 'SELECT COUNT(*) AS complete FROM reliablyme.commitment WHERE helper_id=\'' + req.param("messenger user id") +'\' AND commitmentStatus_id=5;';
		var commitmentsQuery = 'SELECT COUNT(*) AS total FROM reliablyme.commitment WHERE helper_id=\'' + req.param("messenger user id") + '\';';
		var params = [];

		console.log("commitmentsCompleteQuery "+commitmentsCompleteQuery);
		sails.sendNativeQuery(commitmentsQuery, params).exec(function(err1, commitments) {
			if(!err1) {
				console.log("commitmentsQuery "+commitmentsQuery);
				sails.sendNativeQuery(commitmentsCompleteQuery, params).exec(function(err2, completes) {
					if(!err2) {
						var jcommitments = JSON.parse(JSON.stringify(commitments));
						var jcompletes = JSON.parse(JSON.stringify(completes));
						var jcomarray = jcommitments.rows;
						var jtot= jcomarray[0].total;
						var jcomp =jcompletes.rows;
						var jcomps = jcomp[0].complete;
						var rating = Math.round(Number(jcomps)/Number(jtot)* 1000);
						var total = Number(jtot);
						return res.ok({"set_attributes": {"Reliabilityrating": rating, "completedNumCommitments": total }});
					}
					else {
						console.log("Error calling commitmentsCompleteQuery");
					}
				});
			}
			else {
				console.log("Error calling commitmentsQuery");
			}
	    });
	},

	GetReliabilityRatingUser: async function (req, res) {
		console.log("Called GetReliabilityRatingUser", req.allParams());
		var commitmentsCompleteQuery = 'SELECT COUNT(*) AS complete FROM reliablyme.commitment WHERE helper_id=\'' + req.param("userid") +'\' AND commitmentStatus_id=5;';
		var commitmentsQuery = 'SELECT COUNT(*) AS total FROM reliablyme.commitment WHERE helper_id=\'' + req.param("messenger user id") + '\';';
		var params = [];

		console.log("commitmentsCompleteQuery "+commitmentsCompleteQuery);
		sails.sendNativeQuery(commitmentsQuery, params).exec(function(err1, commitments) {
			if(!err1) {
				console.log("commitmentsQuery "+commitmentsQuery);
				sails.sendNativeQuery(commitmentsCompleteQuery, params).exec(function(err2, completes) {
					if(!err2) {
						var jcommitments = JSON.parse(JSON.stringify(commitments));
						var jcompletes = JSON.parse(JSON.stringify(completes));
						var jcomarray = jcommitments.rows;
						var jtot= jcomarray[0].total;
						var jcomp =jcompletes.rows;
						var jcomps = jcomp[0].complete;
						var rating = Math.round(Number(jcomps)/Number(jtot)* 1000);
						var total = Number(jtot);
						return res.ok({"set_attributes": {"Reliabilityrating": rating, "completedNumCommitments": total }});
					}
					else {
						console.log("Error calling commitmentsCompleteQuery");
					}
				});
			}
			else {
				console.log("Error calling commitmentsQuery");
			}
	    });
	},

	GetCompleteUserList: async function (req, res) {
		console.log("Called GetCompleteUserList", req.allParams());
		var commitmentQuery = `
			SELECT 
					commit.id AS commitment_id, 
					comStat.commitmentStatusName AS statusName, 
					commit.commitmentOffer AS offer, 
					commit.commitmentDueDate AS dueDate,
					commit.completionTransaction as TX
				FROM reliablyme.commitment AS commit 
			    JOIN reliablyme.commitmentstatus AS comStat ON comStat.id=commit.commitmentStatus_id
			    WHERE commit.commitmentStatus_id=5 AND helper_id = '` + req.param('userid') + `'
			    ORDER BY commit.commitmentDueDate; `;

		console.log(commitmentQuery);
		var params = [];

		sails.sendNativeQuery(commitmentQuery, params).exec(function(err, items) {
			if(err) {
				console.log(err);
				return res.ok({});
			}
			else {
				var convRaw = JSON.parse(JSON.stringify(items));
				console.log("Found commitment records for: ", commitmentQuery, " result:", convRaw.rows);
				// Build up JSON to send back
				return res.json({records: JSON.parse(JSON.stringify(convRaw.rows))});
			}
	    });
	},

	GetIncompleteUserList: async function (req, res) {
		console.log("Called GetIncompleteUserList", req.allParams());
		var commitmentQuery = `
			SELECT 
					commit.id AS commitment_id, 
					comStat.commitmentStatusName AS statusName, 
					commit.commitmentOffer AS offer, 
					commit.commitmentDueDate AS dueDate.
					commit.offerTransaction as TX
				FROM reliablyme.commitment AS commit 
			    JOIN reliablyme.commitmentstatus AS comStat ON comStat.id=commit.commitmentStatus_id
			    WHERE commit.commitmentStatus_id=2 AND helper_id = '` + req.param('userid') + `'
			    ORDER BY commit.commitmentDueDate; `;
		
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

	blockchainRecord: async function (req, res) {
		console.log("Called blockchainRecord", req.allParams());

	    var commitment = await Commitment.findOne({id: req.param("commitmentId")});

	    if (!commitment) {
  			return res.notFound('Could not find Finn, sorry.');
		}

		var ABI = [
				{
					"constant": true,
					"inputs": [
						{
							"name": "",
							"type": "uint256"
						},
						{
							"name": "",
							"type": "uint256"
						}
					],
					"name": "byPerson",
					"outputs": [
						{
							"name": "offerDate",
							"type": "uint256"
						},
						{
							"name": "completeDate",
							"type": "uint256"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [
						{
							"name": "userId",
							"type": "uint256"
						},
						{
							"name": "eventId",
							"type": "uint256"
						}
					],
					"name": "getOffer",
					"outputs": [
						{
							"name": "offerDate",
							"type": "uint256"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [
						{
							"name": "userId",
							"type": "uint256"
						},
						{
							"name": "eventId",
							"type": "uint256"
						}
					],
					"name": "getCommitment",
					"outputs": [
						{
							"name": "offerDate",
							"type": "uint256"
						},
						{
							"name": "completeDate",
							"type": "uint256"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [],
					"name": "owner",
					"outputs": [
						{
							"name": "",
							"type": "address"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				},
				{
					"constant": false,
					"inputs": [
						{
							"name": "userId",
							"type": "uint256"
						},
						{
							"name": "eventId",
							"type": "uint256"
						}
					],
					"name": "setOffer",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function"
				},
				{
					"constant": true,
					"inputs": [
						{
							"name": "userId",
							"type": "uint256"
						},
						{
							"name": "eventId",
							"type": "uint256"
						}
					],
					"name": "getComplete",
					"outputs": [
						{
							"name": "completeDate",
							"type": "uint256"
						}
					],
					"payable": false,
					"stateMutability": "view",
					"type": "function"
				},
				{
					"constant": false,
					"inputs": [
						{
							"name": "userId",
							"type": "uint256"
						},
						{
							"name": "eventId",
							"type": "uint256"
						}
					],
					"name": "setComplete",
					"outputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "function"
				},
				{
					"inputs": [],
					"payable": false,
					"stateMutability": "nonpayable",
					"type": "constructor"
				}
			];

		const Web3 = require('web3');

		//console.log('Web3=', Web3);
		const Web3Interface = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/Oi8SElNW8FHvmOFIzVUs'));

		// Create the contract object
		const ReliablyMEcommitments = new Web3Interface.eth.Contract(ABI,'0x44a4faebf4bf0e3a467c84eaf68dd0065d20b23d');

		// Get the private key from database
		var settings = await Settings.find({});
		console.log(settings[0].privKey);

		// Create a transaction object of the contract setOffer method
		const setOffer = ReliablyMEcommitments.methods.setOffer(1,1);

		const encodedABI = setOffer.encodeABI();
		const tx = {
		  from: '0x5aB5E52245Fd4974499aa625709EE1F5A81c8157',
		  to: '0x44a4faebf4bf0e3a467c84eaf68dd0065d20b23d',
		  gas: 2000000,
		  data: encodedABI,
		};

		const account = Web3Interface.eth.accounts.privateKeyToAccount(settings[0].privKey);
		console.log(account);
		Web3Interface.eth.getBalance('0x5aB5E52245Fd4974499aa625709EE1F5A81c8157').then(console.log);

		// Signh the transaction and send it
		Web3Interface.eth.accounts.signTransaction(tx, settings[0].privKey).then(signed => {
			console.log("Signed=:", signed);
		    const tran = Web3Interface.eth.sendSignedTransaction(signed.rawTransaction)
		    .on('confirmation', (confirmationNumber, receipt) => {
		      console.log('confirmation: ' + confirmationNumber);
		    })
		    .on('transactionHash', hash => {
		      console.log('hash');
		      console.log(hash);
		    })
		    .on('receipt', receipt => {
		      console.log('reciept');
		      console.log(receipt);
		    })
		    .on('error', console.error);
		});

		console.log('Called setOffer');

  		return res.ok();
	},

};

