module.exports = {


  friendlyName: 'Commitmentlist',


  description: 'Commitmentlist something.',


  inputs: {
    eventid: {
      type: "number",
      description: 'Event ID',
      required: true
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {
    console.log("Called Commitmentlist Action", this.req.allParams());
    var loggedInUser = await User.findOne({ id: this.req.session.userId});
    console.log(loggedInUser);
    console.log(loggedInUser.isSuperAdmin);
    
    var organizerWhere = '';
    var eventWhere = '';
    if (inputs.eventid>0)
        eventWhere += ' AND events.id ='+inputs.eventid+' ';
    if (!loggedInUser.isSuperAdmin) {
      organizerWhere =' AND eventorg.organizer_id=' + this.req.session.userId +' ';
    }

    var commitmentQuery = `
      SELECT 
          commit.id AS commitment_id, 
          events.id AS event_id,       
          DATE_FORMAT(convert_tz(from_unixtime(commit.createdAt/1000), '+00:00','-04:00'),'%Y-%m-%d %H:%i') AS CommitmentDate,
          IF(commit.commitmentStatus_id=5, DATE_FORMAT(convert_tz(from_unixtime(commit.updatedAt/1000), '+00:00','-04:00'),'%Y-%m-%d %H:%i'), "") AS FulfilledDate,
          commit.commitmentDueDate AS DueDate, 
	  (select fu.prefFirstName from reliablyme.user fu where fu.messengerUserId =commit.helper_id) AS First,
          (select lu.prefLastName from reliablyme.user lu where lu.messengerUserId =commit.helper_id) AS Last,
          volunteer.messengerUserId AS messenger_id, 
          comStat.id AS comStat_id, 
          comStat.commitmentStatusName AS Status, 
          commit.commitmentOffer AS Offer, 
          events.eventName as Event
        FROM reliablyme.commitment AS commit 
        JOIN reliablyme.user AS volunteer ON commit.helper_id=volunteer.messengerUserId 
          JOIN reliablyme.commitmentstatus AS comStat ON comStat.id=commit.commitmentStatus_id
          JOIN reliablyme.event AS events ON events.id=commit.event_id
          JOIN reliablyme.eventorganizer AS eventorg ON eventorg.event_id=commit.event_id
          `+organizerWhere+`
          `+eventWhere+`
          GROUP BY commit.id
          ORDER BY commit.commitmentDueDate, comStat.commitmentStatusName DESC; `;
      
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
