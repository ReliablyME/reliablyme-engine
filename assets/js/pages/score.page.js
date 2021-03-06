parasails.registerPage('score', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    //…
    rating: 0,
    fulfilled: [],
    closed: [],
    pending: [],
    index: 0,
    entry: 0,
    key: 0,
    searchQuery: '',
    gridColumns: ['Event', 'CommitmentDate', 'DueDate', 'Verify'],
    gridColumns1: ['Event', 'CommitmentDate', 'DueDate', 'Verify', 'Badge','FulfilledDate'],
    route: '',
    completedNum: '',
    prefFirstName: '',
    prefLastName: '',
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
    // get the parameter from the query string in the URL
    var qstring = location.search;
    var qarray = qstring.split("id=");
    this.route=qarray[1];
    this.loadComplete();
    this.loadIncomplete();
    this.loadPending();
    this.loadRating();
  },
  mounted: async function() {
    $('div#Pending  > table > thead > tr > th:nth-child(2) ').click();
    $('div#Fulfilled  > table > thead > tr > th:nth-child(6) ').click();
    $('div#Closed  > table > thead > tr > th:nth-child(3) ').click();
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    loadComplete: async function() {

      var list = await Cloud.fulfilledlist(this.route);
      var complete = list.records;
      // Fix date formats
      for(var i in complete) {
        complete[i].DueDate = complete[i].DueDate.toString().substring(0,16).replace('T',' ');
        complete[i].Verify = "https://rinkeby.etherscan.io/tx/" + complete[i].Verify;
      }
      this.fulfilled = complete;
    },

    loadPending: async function() {

      var list = await Cloud.pendinglist(this.route);
      var pending = list.records;
      // Fix date formats
      for(var i in pending) {
        pending[i].DueDate = pending[i].DueDate.toString().substring(0,16).replace('T',' ');
        pending[i].Verify = "https://rinkeby.etherscan.io/tx/" + pending[i].Verify;
      }
      this.pending = pending;
    },

    loadIncomplete: async function() {

      var list = await Cloud.incompletelist(this.route);
      var incomplete = list.records;
      // Fix date formats
      for(var i in incomplete) {

        incomplete[i].DueDate = incomplete[i].DueDate.toString().substring(0,16).replace('T',' ');
        incomplete[i].Verify = "https://rinkeby.etherscan.io/tx/" + incomplete[i].Verify;
      }
      this.closed = incomplete;
    },

    loadRating: async function() {
      var rating = await Cloud.reliabilityrating(this.route);
      this.rating = rating.Reliabilityrating;
      this.completedNum = rating.completedNum;
      this.prefFirstName = rating.prefFirstName;
      this.prefLastName =rating.prefLastName;
    },

  }

});
