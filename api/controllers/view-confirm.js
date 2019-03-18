module.exports = {


  friendlyName: 'View confirm',


  description: 'Display "Confirm" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/confirm'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
