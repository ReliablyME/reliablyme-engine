module.exports = {


  friendlyName: 'Pendinglist',


  description: 'Pendinglist something.',


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

    console.log("Called Pendinglist for ", inputs.messengeruserid);

    //var commits = Commitment.find({helper_id: inputs.messengeruserid}).populate(Event)
  
    var commitmentQuery = `
      SELECT 
        commit.id AS commitment_id, 
        comStat.commitmentStatusName AS statusName, 
        commit.commitmentOffer AS offer, 
        DATE_FORMAT(convert_tz(from_unixtime(commit.createdAt/1000), '+00:00','-04:00'),'%Y-%m-%d %H:%i') AS CommitmentDate,
        commit.commitmentDueDate AS DueDate,
        commit.offerTransaction as Verify,
        comEvent.eventName AS Event
      FROM reliablyme.commitment AS commit 
        JOIN reliablyme.commitmentstatus AS comStat ON comStat.id=commit.commitmentStatus_id
        JOIN reliablyme.event AS comEvent ON comEvent.id=commit.event_id
        WHERE commit.commitmentStatus_id=2 AND commit.commitmentDueDate > CURDATE() AND helper_id = '` + inputs.messengeruserid + `'
        ORDER BY commit.createdAt DESC; 
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
