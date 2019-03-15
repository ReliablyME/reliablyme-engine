module.exports = {


  friendlyName: 'View score',


  description: 'Display "Score" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/score'
    }

  },


  fn: async function () {

    // Respond with view.
    return {};

  }


};
