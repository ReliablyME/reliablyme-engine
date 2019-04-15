module.exports = {


  friendlyName: 'Incompletelist',


  description: 'Incompletelist something.',


  inputs: {
    messengeruserid: {
      type: "number",
      description: 'Facebook messenger id for user and bot',
      required: true
    },
  },


  exits: {

  },


  fn: async function (inputs) {

    console.log("Called Incompletelist for ", inputs.messengeruserid);

    //var commits = Commitment.find({helper_id: inputs.messengeruserid}).populate(Event)
  
    var incompleteQuery = `
      SELECT 
        commit.id AS commitment_id, 
        comStat.commitmentStatusName AS statusName, 
        commit.commitmentOffer AS offer, 
        commit.commitmentDueDate AS DueDate,
        commit.offerTransaction as Verify,
        comEvent.eventName AS Event,
        comEvent.eventBadgeURL as Badge,
        comEvent.eventURL as EventURL
      FROM reliablyme.commitment AS commit 
        JOIN reliablyme.commitmentstatus AS comStat ON comStat.id=commit.commitmentStatus_id
        JOIN reliablyme.event AS comEvent ON comEvent.id=commit.event_id
        WHERE (commit.commitmentStatus_id=5 OR ( commit.commitmentStatus_id=2 AND commit.commitmentDueDate < CURDATE() )) AND helper_id = '` + inputs.messengeruserid + `' 
        ORDER BY commit.commitmentDueDate; 
      `;

    console.log(incompleteQuery);
    var params = [];

    try {
      var qResult = await sails.sendNativeQuery(incompleteQuery, params);
    }
    catch(err) {
      console.log('Error', err);
      return this.res.ok({});
    } 
    
    //console.log(qResult);
    return this.res.json({records: qResult.rows});

  }

};
