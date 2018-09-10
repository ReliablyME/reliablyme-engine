module.exports = {

	show: async function (req, res) {
		console.log(req.param('eventid'));
		res.view('pages/countmein', {
			layout: 'layouts/layoutcountmein',
            eventid : req.param('eventid'),
        });
	},
};