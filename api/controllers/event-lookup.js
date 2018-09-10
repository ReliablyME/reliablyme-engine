module.exports = {


  friendlyName: 'Event lookup',


  description: '',


  inputs: {
   event: {
      type: "number",
      description: 'ID of the event to get info on',
      required: true,
    },
  },


  exits: {

  },


  fn: async function (inputs, exits) {

  	console.log('event lookup ', inputs.event);

	var event = await Event.findOne({ id: inputs.event});
	console.log(event);
    return exits.success({"eventName": event.eventName, "eventLocation": event.eventLocation, "eventDescription": event.eventDescription, "eventDate": event.eventDate, "eventLogo": event.eventLogo });

  },


};

