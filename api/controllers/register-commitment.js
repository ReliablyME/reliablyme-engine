module.exports = {


  friendlyName: 'Register Commitment',


  description: 'Record the commitment for the event.',


  inputs: {

    eventId: {
      type: "number",
      description: 'ID of the event to register the user for',
      required: true
    },
    prefName: {
      type: "string",
      description: 'Preferred name of user',
      required: true
    },
    email: {
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

    // Update the record for the logged-in user.
    //await User.update({ id: this.req.me.id })
    //.set({
    //  password: hashed
    //});

    return exits.success();

  }


};
