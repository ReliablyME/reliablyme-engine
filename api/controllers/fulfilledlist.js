module.exports = {


  friendlyName: 'Fulfilledlist',


  description: 'Fulfilledlist something.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    var list = await Commitment.find();
    console.log(list);
    return this.res.json(list);

  }


};
