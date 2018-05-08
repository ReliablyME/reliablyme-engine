/**
 * Commitment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    helper_id: {
      type: 'string',
      //required: true,
      description: 'messenger user id of helper',
    },

    entreprenuer_id: {
      type: 'string',
      //required: true,
      description: 'messenger user id of entrepreneur',
    },

    commitmentOffer: {
      type: 'string',
      //required: true,
      description: 'Text description of commitment offer',
    },

    commitmentDueDate: {
      type: 'ref',
      description: 'Date to commit to',
      columnType: 'datetime',
    },

    commitmentStatus_id: {
      type: 'number',
      description: 'id of status of commmitment',
    },

    event_id: {
      type: 'number',
      description: 'id of the event this commitment is for',
    },

  }
};

