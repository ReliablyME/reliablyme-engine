module.exports = {


  friendlyName: 'Commitmentlist',


  description: 'Commitmentlist something.',


  inputs: {

  },


  exits: {

  },


  fn: async function (inputs) {

    console.log("Called Commitmentlist Action", this.req.allParams());
    var loggedInUser = await User.findOne({ id: this.req.session.userId});
    var commitmentQuery = `
      SELECT 
          commit.id AS commitment_id, 
          events.id AS event_id,
          commit.commitmentDueDate AS DueDate, 
          volunteer.prefFirstName AS First, 
          volunteer.prefLastName AS Last,
          volunteer.messengerUserId AS messenger_id, 
          comStat.id AS comStat_id, 
          comStat.commitmentStatusName AS Status, 
          commit.commitmentOffer AS Offer, 
          events.eventName as Event
        FROM reliablyme.commitment AS commit 
        JOIN reliablyme.user AS volunteer ON commit.helper_id=volunteer.messengerUserId 
          JOIN reliablyme.commitmentstatus AS comStat ON comStat.id=commit.commitmentStatus_id
          JOIN reliablyme.event AS events ON events.id=commit.event_id
          JOIN reliablyme.eventorganizer AS eventorg ON eventorg.event_id=commit.event_id AND eventorg.organizer_id=` + this.req.session.userId +`
          ORDER BY commit.commitmentDueDate, comStat.commitmentStatusName DESC, volunteer.prefFirstName; `;
    
    var params = [];

    console.log("Database query:", commitmentQuery);
    try {
      var rawResult = await sails.sendNativeQuery(commitmentQuery, params);
    }
    catch(err) {
      console.log('Error', err);
      return this.res.ok({});
    } 
    
    //console.log(rawResult);
    return this.res.json({records: JSON.parse(JSON.stringify(rawResult.rows))});
    
    //return this.res.ok({});

  }


};
