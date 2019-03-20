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


  fn: async function(inputs, exits) {

		console.log("Called send-transaction-to-blockchain", inputs);

		// Get the commitment record so we can get the user and event IDs
	    var commitment = await Commitment.find({where: {id: inputs.commitmentID}});

	    if (!commitment) {
  			return exits.success();
		};

		const userID = commitment[0].id;
		const eventID = commitment[0].event_id;

		console.log("For user: ", userID, " and event: ", eventID);


		// Get the web3 interface module
		const Web3 = require('web3');

		// Use the Infura.io open node for recording transactions
		const Web3Interface = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/2a0b6c4ab3cd4eb2bf180900545224d8'));

		var settings = await Settings.find({});
		var privateKey = settings[0].privKey;
		console.log('Private key : ',privateKey);

		var fs = require("fs");
	  var contract = JSON.parse(fs.readFileSync(__dirname+"/../../assets/blockchain/smartcontract.abi"));
		//console.log('Contract ABI: ',contract);

	  const contractAddress = '0xde1277edfee54d6392a3a1b48cd2a281c92d9647';
		console.log('Contract    : ',contractAddress);

	  var userAddress = "0x5aB5E52245Fd4974499aa625709EE1F5A81c8157";
		console.log('Account     : ',userAddress);

		// Check the current balance - more for debugging
		const account = Web3Interface.eth.accounts.privateKeyToAccount(privateKey);
		Web3Interface.eth.getBalance(userAddress).then(console.log);


	  const SimpleContract = new Web3Interface.eth.Contract(contract, contractAddress);
	  console.log("Contract obj: ", SimpleContract.options.address);

		var methodCall;
		if(inputs.statusID==2) {
			// Create a transaction object of the contract setOffer method
			methodCall = SimpleContract.methods.setOffer(userID,eventID);
		}
		else {
			// Create a transaction object of the contract setComplete method
			methodCall = SimpleContract.methods.setComplete(userID,eventID);
		}
		console.log('Methodcall set');

		Web3Interface.eth.net.getId().then(console.log);

		const encodedABI = methodCall.encodeABI();
	  const tx = {
	    from: userAddress,   // This is the default wallet account to use
	    to: SimpleContract.options.address,   // This is the contract instance
	    gas: Web3Interface.utils.toHex("30000").toString(),
	    gasPrice: Web3Interface.utils.toHex(Web3Interface.utils.toWei('2', 'gwei')).toString(),
	    value: '0x00',
	    nonce: '0x00',
	    data: encodedABI,
	    chainid: 4,
	  };
	  console.log('TX: ', tx);

	  Web3Interface.eth.accounts.signTransaction(tx, privateKey).then(signed => {
	  	console.log('Signed transaction: ', signed);
	    const tran = Web3Interface.eth.sendSignedTransaction(signed.rawTransaction)
	      .on('confirmation', (confirmationNumber, receipt) => {
	        console.log('confirmation: ' + confirmationNumber);
	      })
	      .on('transactionHash', hash => {
	        console.log('hash: ' + hash);
	      })
	      .on('receipt', receipt => {
	        console.log('reciept ' + receipt);
	      })
	      .on('error', console.error);
	  });

	  return exits.success();

/*
		var ABI = [
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
				"inputs": [],
				"payable": false,
				"stateMutability": "nonpayable",
				"type": "constructor"
			},
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
			}
		];

		// Get the web3 interface module
		const Web3 = require('web3');

		// Use the Infura.io open node for recording transactions
		const Web3Interface = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/Oi8SElNW8FHvmOFIzVUs'));

		// Create the contract object
		const ReliablyMEcommitments = new Web3Interface.eth.Contract(ABI,'0xde1277EdFEe54d6392a3A1b48Cd2A281c92D9647');

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
	 	var nonceComplete = await Web3Interface.eth.getTransactionCount('0x5aB5E52245Fd4974499aa625709EE1F5A81c8157');
			
			
	 	var noncePending = await Web3Interface.eth.getTransactionCount('0x5aB5E52245Fd4974499aa625709EE1F5A81c8157', "pending");
	 	if(noncePending>nonceComplete) {
	 		nonceNext = noncePending + 1;
	 	}
	 	else {
	 		nonceNext = nonceComplete + 1;
	 	}

		// Create the raw transaction
		const tx = {
		  from: '0x5aB5E52245Fd4974499aa625709EE1F5A81c8157', 	// This is the default wallet account to use
		  to: '0xde1277EdFEe54d6392a3A1b48Cd2A281c92D9647',		// This is the contract instance
		  gas: Web3Interface.utils.toHex(1000000), //1m, also tried string '1000000'
    	gasPrice: Web3Interface.utils.toHex(20000000000), //20gwei, also tried string '20000000000'
		  data: encodedABI,
		  nonce: nonceNext,
		};

		// Get the account object from the private key
		const account = Web3Interface.eth.accounts.privateKeyToAccount(settings[0].privKey);
		console.log(account);

		// Check the current balance - more for debugging
		Web3Interface.eth.getBalance('0x5aB5E52245Fd4974499aa625709EE1F5A81c8157').then(console.log);

		// Sign the transaction and send it
		console.log('Priv key', settings[0].privKey);
		console.log('Tx      ', tx);
		
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
*/
  },

};
