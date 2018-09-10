module.exports = {


  friendlyName: 'Register Commitment',


  description: 'Record the commitment for the event.',


  inputs: {

    event: {
      type: "number",
      description: 'ID of the event to register the user for',
      required: true
    },
    prefName: {
      type: "string",
      description: 'Preferred name of user',
      required: true
    },
    emailAddress: {
      type: "string",
      description: 'User email address',
      required: true
    },
    phone: {
      type: "string",
      description: 'User phone',
      required: true
    },
    password: {
      type: "string",
      description: 'Password for user account',
      required: true
    },


  },


  fn: async function (inputs, exits) {

  	console.log("Register web commitment ", inputs);
    // Hash the new password.
    var hashed = await sails.helpers.passwords.hashPassword(inputs.password);
    var self = this;
    var userId = 0;
    var today = new Date();

    // Create the user
    var newUser = await User.create(
      {
          fullName: inputs.prefName,
          messengerUserId: today,
          emailAddress: inputs.emailAddress,
          phoneNumber: inputs.phone,
          password: hashed,
      }, function (err, user) {
        if(err) {
          console.log("error creating user ", err);
        }
        else {
          console.log("Created web user ", user);
          self.userId = user.id;        
        }
      }
    );

    // Create the commitment
    var newCommitment = await Commitment.create(
      {
          helper_id: this.userId,
          entreprenuer_id: 1,
          commitmentOffer: "Attend event",
          commitmentDueDate: today,
          commitmentStatus_id: 2,
          event_id: inputs.event,
      }
      ).fetch();



    // Update the record for the logged-in user.
    //await User.update({ id: this.req.me.id })
    //.set({
    //  password: hashed
    //});

    return exits.success();

  }


};
