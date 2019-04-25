module.exports = {


  friendlyName: 'Eventlist',


  description: 'Eventlist something.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    console.log("Called eventist Action", this.req.allParams());
    var loggedInUser = await User.findOne({ id: this.req.session.userId});
    var eventWhere = '';
    if (!loggedInUser.isSuperAdmin) {
        eventWhere = ' WHERE id in (SELECT event_id FROM reliablyme.eventorgainzer WHERE organizer_id = '+this.req.session.userId +') ';
    }

    var eventQuery = `
      SELECT 
          id, 
          eventName
        FROM reliablyme.event 
        `+eventWhere+`
          ORDER BY eventName DESC; `;
    var params = [];

    console.log("Database query:", eventQuery);
    try {
      var rawResult = await sails.sendNativeQuery(eventQuery, params);
    }
    catch(err) {
      console.log('Error', err);
      return this.res.ok({});
    } 
    
    //console.log(rawResult);
    return this.res.json({records: JSON.parse(JSON.stringify(rawResult.rows)),isSuperAdmin:loggedInUser.isSuperAdmin});

  }

};
