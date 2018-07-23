var request = require('request');
var http = require('http');
var https = require('https');

module.exports = {


  friendlyName: 'Send message to helper of acceptance',


  description: 'Send a message to the helper in messenger using ChatFuel boardcast API.',


  inputs: {
    commitmentID: {
      description: 'ID ofcommitment that is being recorded',
      type: 'number',
      required: true
    },

    statusID: {
      description: 'ID of status being recorded',
      type: 'number',
      required: true
    },
  },


  exits: {

    success: {
      outputFriendlyName: 'Blockchain recorded',
	  responseType: 'ok'
    },

    notfound: {
      outputFriendlyName: 'Cant find commitment record',
	  responseType: 'ok'
    },

    errBlochchain: {
      outputFriendlyName: 'Error recording to blockchain',
	  responseType: 'ok'
    },
  },


  fn: async function(inputs, exits) {

		console.log("Called send-transaction-to-blockchain", inputs);

		// Get the commitment record so we can get the user and event IDs
	    var commitment = await Commitment.find({where: {id: inputs.commitmentID}});

	    if (!commitment) {
  			return exits.notFound();
		};

		const userID = commitment[0].id;
		const eventID = commitment[0].event_id;

		console.log("For user: ", userID, " and event: ", eventID);

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

		// Get the web3 interface module
		const Web3 = require('web3');

		// Use the Infura.io open node for recording transactions
		const Web3Interface = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/Oi8SElNW8FHvmOFIzVUs'));

		// Create the contract object
		const ReliablyMEcommitments = new Web3Interface.eth.Contract(ABI,'0x299d7629833a14eacc378848bbd7bd72b735bcb5');

		// Get the private key from database
		var settings = await Settings.find({});
		console.log(settings[0].privKey);

		// Get the method to call from the ABI
		var methodCall;
		if(inputs.statusID==2) {
			// Create a transaction object of the contract setOffer method
			methodCall = ReliablyMEcommitments.methods.setOffer(userID,eventID);
		}
		else {
			// Create a transaction object of the contract setComplete method
			methodCall = ReliablyMEcommitments.methods.setComplete(userID,eventID);
		}

		// Get the ABI
	 	const encodedABI = methodCall.encodeABI();

	 	// Find out the most recent nonce (nextr transaction number)
	 	var nonceNext = 0;
	 	var nonceComplete = await Web3Interface.eth.getTransactionCount('0x299d7629833a14eacc378848bbd7bd72b735bcb5');
			
			
	 	var noncePending = await Web3Interface.eth.getTransactionCount('0x299d7629833a14eacc378848bbd7bd72b735bcb5', "pending");
	 	if(noncePending>nonceComplete) {
	 		nonceNext = noncePending + 1;
	 	}
	 	else {
	 		nonceNext = nonceComplete + 1;
	 	}

		// Create the raw transaction
		const tx = {
		  from: '0x299d7629833a14eacc378848bbd7bd72b735bcb5', 	// This is the default wallet account to use
		  to: ' 0x961b97a9d2acd9957183a0fac933ef1f475fcf48',		// This is the contract instance
		  gas: 292448,
		  gasPrice: Web3Interface.utils.toHex(20000000000),
		  data: encodedABI,
		  nonce: nonceNext,
		};

		// Get the account object from the private key
		const account = Web3Interface.eth.accounts.privateKeyToAccount(settings[0].privKey);
		console.log(account);

		// Check the current balance - more for debugging
		Web3Interface.eth.getBalance('0x299d7629833a14eacc378848bbd7bd72b735bcb5').then(console.log);

		// Sign the transaction and send it
		Web3Interface.eth.accounts.signTransaction(tx, settings[0].privKey).then(signed => {
			console.log("Signed=:", signed);
		    const tran = Web3Interface.eth.sendSignedTransaction(signed.rawTransaction)
		    .on('confirmation', (confirmationNumber, receipt) => {
		      console.log('confirmation: ' + confirmationNumber);
		    })
		    .on('transactionHash', hash => {
		      console.log('hash');
		      console.log(hash);
		      // Save this tx hash to commitment table to display as proof
		      if(inputs.statusID==2) {
		      	// offer accepted
	    	  	Commitment.update({id:inputs.commitmentID}).set({offerTransaction:hash}).exec(function(err, items){});	
	    	  }
	    	  else {
	    	  	// completion accepted
	    	  	Commitment.update({id:inputs.commitmentID}).set({completionTransaction:hash}).exec(function(err, items){}); 
	    	  }
		    })
		    .on('receipt', receipt => {
		      console.log('reciept');
		      console.log(receipt);
		    })
		    .on('error', console.error);
		});

		console.log('Blockchain in action');


    console.log('CommitmentOfferAccepted returned');
    return exits.success();
  },

};
