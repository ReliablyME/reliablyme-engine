module.exports = {


  friendlyName: 'Acceptoffer',


  description: 'Acceptoffer something.',


  inputs: {
    commitmentID: {
      type: 'number',
      description: 'ID of the commitment to change status',
      required: true
    },
 
  },


  exits: {
    success: {
      description: 'The message was sent successfully.'
    },
  },


  fn: async function (inputs) {

    console.log("Called AcceptOffer", this.req.allParams());
    var retval = await Commitment.update({id:inputs.commitmentID}).set({commitmentStatus_id:5});

    console.log("returned: ", retval);

    var commitment = await Commitment.find({where: {id:inputs.commitmentID}});
    console.log("Got commitment ",commitment.commitmentOffer);
    var event = await Event.find({where: {id:commitment[0].event_id}});
    console.log("updated commitmentStatus_id:5");

/*
    // Send back through ChatFuel
    await sails.helpers.sendCommitmentCompletionAcceptedToHelper.with(
      {
        helperID: commitment[0].helper_id,
        eventName: event[0].eventName,
        botID: event[0].botID,
      }
    );
*/

    // Record into blockchain
    await sails.helpers.sendTransactionToBlockchain.with(
      {
        commitmentID: commitment[0].id,
        statusID: 5,
      }
    );

    //return exits.success();


  }


};
