parasails.registerPage('confirm', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    rating: 0,
    commitments: [],
    index: 0,
    entry: 0,
    key: 0,
    searchQuery: '',
    gridColumns: ['First', 'Last', 'Event', 'DueDate', 'Offer'],
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    this.loadTable();
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    loadTable: async function() {

      var commitmentsList = await Cloud.commitmentlist();
      for(var i in commitmentsList.records) {
        commitmentsList.records[i].DueDate= commitmentsList.records[i].DueDate.toString().substring(0,10);
        if(commitmentsList.records[i].comStat_id==2) {
          commitmentsList.records[i].Offer='';
        }
        else {
          commitmentsList.records[i].Offer="Closed";
        }
      }

      this.commitments = commitmentsList.records;

    },
    //…
  }
});
