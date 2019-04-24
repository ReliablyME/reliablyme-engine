module.exports = {


  friendlyName: 'Eventlist',


  description: 'Eventlist something.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {
    console.log("Called eventist Action", this.req.allParams());
    
    var eventQuery = `
      SELECT 
          id, 
          eventName
        FROM reliablyme.event 
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
    return this.res.json({records: JSON.parse(JSON.stringify(rawResult.rows))});

  }

};
