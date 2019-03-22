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

		// Get the private key
		var settings = await Settings.find({});
		var privateKey = settings[0].privKey;

		// Get the contract info
		var fs = require("fs");
	  var contract = JSON.parse(fs.readFileSync(__dirname+"/../../assets/blockchain/smartcontract.abi"));
	  const contractAddress = '0x97a2bc4e8b554c8abac97a04e6c849a15e5c0f17';

		// Get account and check the urrent balance
	  var userAddress = "0x0cC0437855833E8b0ddD85fAE4b97C5C675D0194";
	  Web3Interface.eth.defaultAccount = userAddress;
		var balance = await Web3Interface.eth.getBalance(userAddress);

		// Make the contract object and get the call to contract
	  const SimpleContract = new Web3Interface.eth.Contract(contract, contractAddress);
		var methodCall;
		if(inputs.statusID==2) {
			// Create a transaction object of the contract setOffer method
			methodCall = SimpleContract.methods.setOffer(userID,eventID);
			console.log('Methodcall setOffer');
		}
		else {
			// Create a transaction object of the contract setComplete method
			methodCall = SimpleContract.methods.setComplete(userID,eventID);
			console.log('Methodcall setComplete');
		}
		const encodedABI = methodCall.encodeABI();

		// Set gas and gas price
		var gas = Web3Interface.utils.toHex("300000").toString();
		var price = Web3Interface.utils.toHex(Web3Interface.utils.toWei('20', 'gwei')).toString();

		// get the next nonce
		var count = await Web3Interface.eth.getTransactionCount(userAddress, 'pending');

		// Build the transaction record
	  const tx = {
	    from: userAddress,   // This is the default wallet account to use
	    to: contractAddress,   // This is the contract instance
	    gas: gas,
	    gasPrice: price,
	    data: encodedABI,
	  };

	  // Sign the transation
	  var signed = await Web3Interface.eth.accounts.signTransaction(tx, privateKey);

	  // Dump out for debugging
		console.log('Account    : ',userAddress);
		console.log('Private key: ',privateKey);
		console.log('Contract   : ',contractAddress);
		console.log("Nonce        : ", count);
		console.log("Gas        : ", gas);
		console.log("Price      : ", price);
		console.log("encodedABI : ", encodedABI);
	  console.log('TX: ', tx);
		console.log("Account balance = ", balance);
	  console.log("signed: ", signed.rawTransaction);

		var sigObj = await Web3Interface.eth.accounts.sign('Some data', userAddress);
		var sigAccount = await Web3Interface.eth.accounts.recover(sigObj);
		console.log("Account signed = ", sigAccount);



		const eTx = require('ethereumjs-tx');
		const pKey = Buffer.alloc(32, privateKey, 'hex');

		const rawTx = {
			nonce: count + 1,
		  gasPrice: '0x09184e72a000',
		  gasLimit: '0x27100',
		  from: userAddress,
		  to: contractAddress,
		  value: '0x00',
		  data: encodedABI
		};

		const stx = new eTx(rawTx);
		stx.sign(pKey);

		const serializedTx = stx.serialize();

		// console.log(serializedTx.toString('hex'));
		// 0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

		Web3Interface.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('confirmation', (confirmationNumber, receipt) => {
        console.log('confirmation: ' + confirmationNumber);
      })
      .on('transactionHash', hash => {
        console.log('hash: ' + hash);
        // Write hash to database 
				if(inputs.statusID==2) {
					//Write to offerTransaction
					Commitment.update({id:inputs.commitmentID}).set({offerTransaction:hash}).exec(function(err, items){});
				}
				else {
					Commitment.update({id:inputs.commitmentID}).set({completionTransaction:hash}).exec(function(err, items){});
				}
      })
      .on('receipt', receipt => {
        console.log('reciept ' + receipt);
      })
      .on('error', console.error);


/*

  	Web3Interface.eth.accounts.signTransaction(tx, privateKey, function (error, signedTx) {
      if (error) {
      	console.log("TX sign error: ", error);
  		} else {
				Web3Interface.eth.sendSignedTransaction(signedTx.rawTransaction)
      		.on('receipt', function (receipt) {
	          	console.log("Tx signed receipt: ", reciept);
   			});
  		}
    });



	  // Send the signed transaction
	  console.log("sendSignedTransaction");
	  try {
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
	  }
	  catch (error) {
      console.log("TX error: ",error.message);
    }
	  console.log("sendSignedTransaction - sent");
*/
	  return exits.success();
  },

};
