/**
 * Commitment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    helper_id: {
      type: 'number',
      //required: true,
      description: 'user id of helper',
    },

    entreprenuer_id: {
      type: 'number',
      //required: true,
      description: 'user id of entrepreneur',
    },

    commitmentOffer: {
      type: 'string',
      //required: true,
      description: 'Text description of commitment offer',
    },

    commitmentDueDate: {
      type: 'datetime',
      description: 'Date to commit to',
    },

    commitmentStatus_id: {
      type: 'number',
      description: 'id of status of commmitment',
    },

  }
};

