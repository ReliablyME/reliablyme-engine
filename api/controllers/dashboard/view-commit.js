module.exports = {


  friendlyName: 'View commit page',


  description: 'Display the dashboard "commit" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/dashboard/commit',
      description: 'Display the welcome page for authenticated users.'
    },

  },


  fn: async function (inputs, exits) {

     // Create commitment record
    var commit = await Commitment.create( 
      {
        helper_id: this.req.session.me,
        entreprenuer_id: 118,
        commitmentOffer: "Attend Leveraging Financial Technology for Social Good Meetup",
        commitmentDueDate: new Date("2018-04-30"),
        commitmentStatus_id: 2
    }).fetch();
    
/*
	        var transporter = sails.nodemailer.createTransport({
	          service: 'gmail',
	          auth: {
	            user: 'do.not.reply.prototyped@gmail.com',
	            pass: 'PrototypeDreply'
	          }
	        });

	        var today = new Date();
	        var mailOptions = {
	          from: 'do.not.reply.prototyped@gmail.com',
	          to: items.email,
	          subject: 'Thank you for your recent purchase at {{company}}',

	          text: 'We have received your payment of ETH ' +sentamount + ' from your Ethereum account of ' +account+ '.  We will send you more information as the ICO approaches.'
	        };

	        transporter.sendMail(mailOptions, function(error, info){
	          if (error) {
	            console.log(error);
	          } else {
	            console.log('Email sent: ' + info.response);
	          }
	        });        
*/

    return exits.success();

  }


};
