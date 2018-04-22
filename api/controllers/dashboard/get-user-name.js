module.exports = {


  friendlyName: 'Get user name',



  inputs: {

  },


  exits: {

    success: {
      description: 'Name returned.'
    },

    invalidOrExpiredToken: {
      responseType: 'expired',
      description: 'The provided token is expired, invalid, or already used up.',
    },

  },


  fn: async function (inputs, exits) {

  	console.log("get user name");
    // If no token was provided, this is automatically invalid.
    if (!inputs.token) {
      throw 'invalidOrExpiredToken';
    }

    // Get the user with the matching email token.
    var user = await User.findOne({ id: this.req.session.userId});

    // If no such user exists, or their token is expired, bail.
    if (!user) {
      throw 'invalidOrExpiredToken';
    }

    return exits.success({name: user.fullName});

  }


};
