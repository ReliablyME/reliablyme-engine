module.exports = {


  friendlyName: 'Reliabilityrating',


  description: 'Reliabilityrating something.',


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

    console.log("Called ReliabilityRating for ", inputs.messengeruserid);

    var commitmentsCompleteQuery = 'SELECT COUNT(*) AS complete FROM reliablyme.commitment WHERE helper_id=\'' + inputs.messengeruserid +'\' AND commitmentStatus_id=5;';
    var commitmentsQuery = 'SELECT COUNT(*) AS total FROM reliablyme.commitment WHERE helper_id=\'' + inputs.messengeruserid + '\' AND (commitmentStatus_id=5 OR commitmentDueDate <= CURDATE());';
  
    var params = [];

    console.log("commitmentsCompleteQuery "+commitmentsCompleteQuery);
    var completeRet = await sails.sendNativeQuery(commitmentsQuery, params);
    console.log(completeRet);

    console.log("commitmentsQuery "+commitmentsQuery);
    var allRet = await sails.sendNativeQuery(commitmentsCompleteQuery, params);
    console.log(allRet);

    var helperQuery = 'SELECT prefFirstName, prefLastName FROM reliablyme.user WHERE messengerUserId=\'' + inputs.messengeruserid + '\' limit 1';
    console.log("User Name "+helperQuery);
    var helperRet = await sails.sendNativeQuery(helperQuery, params);
    console.log(helperRet);
    // Parse out the SQL total
    var prefFirstName = JSON.parse(JSON.stringify(helperRet.rows[0])).prefFirstName;
    var prefLastName = JSON.parse(JSON.stringify(helperRet.rows[0])).prefLastName;
    // Parse out the SQL total
    var complete = JSON.parse(JSON.stringify(completeRet.rows[0])).total;
    // Parse out the SQL total
    var all = JSON.parse(JSON.stringify(allRet.rows[0])).complete;


    var rating = 0;
    if(all != 0) {
      rating = Math.round(Number(all)/Number(complete)* 1000);
    }
    return this.res.ok({"Reliabilityrating": rating,"completedNum":Number(all),"prefFirstName":prefFirstName,"prefLastName":prefLastName});

  }


};
