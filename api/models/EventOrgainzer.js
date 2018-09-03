/**
 * EventOrganizer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    organizer_id: {
      type: 'number',
      required: true,
      description: 'user id of organizer',
    },

    event_id: {
      type: 'number',
      required: true,
      description: 'event id of the event the organizer can look at',
    },

};

