
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
    route: '',
    searchQuery: '',
    gridColumns: ['First', 'Last', 'Event', 'CommitmentDate', 'DueDate', 'Status', 'FulfilledDate'],
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: async function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);

    var qstring = location.search;
    var qarray = qstring.split("eventid=");
    this.route=qarray[1];
   
    
    this.loadTable();
  },
  mounted: async function() {

    $('div#confirm  > table > thead > tr > th:nth-child(4) ').click();
    var eventsList = await Cloud.eventlist();
    
      var selectHTML ='<table><tr><td>Event:</td><td><select tabindex="-1" id="searchByEventId"  class="select2-hidden-accessible" aria-hidden="true">'+
      '<option value="0">Select All</option>';
    
      for(var i in eventsList.records) {
        //eventsList.records[i].text= eventsList.records[i].eventName.toString();
        //eventsList.records[i].id= eventsList.records[i].id.toString();
        var selected='';
        if (eventsList.records[i].id==this.route) {
          selected = 'selected';
        }
        var selectHTML =selectHTML+'<option value="'+ eventsList.records[i].id+'" '+selected+'>'+ eventsList.records[i].eventName+'</option>';

      }
      var selectHTML =selectHTML+'</select></td></tr></table>';
      $('#searchEventSpan').html(selectHTML);
      $('#searchByEventId').change(function () {    

      var curl = window.location.href;
      var curlparts = curl.split("?eventid=");
      if ($('#searchByEventId').val()==0) {
        var newurl = curlparts[0]
      } else {
        var newurl = curlparts[0]+"?eventid="+$('#searchByEventId').val();
      }
      $(location).attr('href',newurl);
    });  
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    loadTable: async function() {
      if (this.route == undefined) {
        var commitmentsList = await Cloud.commitmentlist(0);
      }
      else {
        var commitmentsList = await Cloud.commitmentlist(this.route);
      }

      //var commitmentsList = await Cloud.commitmentlist(seachByEventId);
      for(var i in commitmentsList.records) {
        commitmentsList.records[i].DueDate= commitmentsList.records[i].DueDate.toString().substring(0,16).replace('T',' ');;
        if(commitmentsList.records[i].comStat_id==2) {
          commitmentsList.records[i].Status='';
        }
        else {
          commitmentsList.records[i].Status="Closed";
        }
      }

      this.commitments = commitmentsList.records;

    },
    //…
  }
});
