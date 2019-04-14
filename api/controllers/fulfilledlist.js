module.exports = {


  friendlyName: 'Fulfilledlist',


  description: 'Fulfilledlist something.',


  inputs: {
    messengeruserid: {
      type: "number",
      description: 'Facebook messenger id for user and bot',
      required: true
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    console.log("Called Fulfilledlist for ", inputs.messengeruserid);

    //var commits = Commitment.find({helper_id: inputs.messengeruserid}).populate(Event)
  
    var commitmentQuery = `
      SELECT 
        commit.id AS commitment_id, 
        comStat.commitmentStatusName AS statusName, 
        commit.commitmentOffer AS offer, 
        commit.commitmentDueDate AS DueDate,
        commit.completionTransaction as Verify,
        comEvent.eventName AS Event,
        comEvent.eventBadgeURL as Badge,
        comEvent.eventURL as EventURL
      FROM reliablyme.commitment AS commit 
        JOIN reliablyme.commitmentstatus AS comStat ON comStat.id=commit.commitmentStatus_id
        JOIN reliablyme.event AS comEvent ON comEvent.id=commit.event_id
        WHERE commit.commitmentStatus_id=5 AND helper_id = '` + inputs.messengeruserid + `'
        ORDER BY commit.commitmentDueDate; 
      `;

    console.log(commitmentQuery);
    var params = [];

    try {
      var qResult = await sails.sendNativeQuery(commitmentQuery, params);
    }
    catch(err) {
      console.log('Error', err);
      return this.res.ok({});
    } 
    
    //console.log(qResult);
    return this.res.json({records: qResult.rows});
  

  }


};
