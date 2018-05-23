/**
 * Event.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    entreprenuer_id: {
      type: 'string',
      //required: true,
      description: 'messenger user id of entrepreneur',
    },

    eventName: {
      type: 'string',
      //required: true,
      description: 'Text name of the event to display',
    },

    eventLocation: {
      type: 'string',
      //required: true,
      description: 'Text description of location to display',
    },

    eventDate: {
      type: 'ref',
      description: 'Date of event',
      columnType: 'datetime',
    },

    botID: {
      type: 'string',
      description: 'ChatFuel bot instance id',
    },

  }
};

