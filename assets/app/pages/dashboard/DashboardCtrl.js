/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('reliablyMe.dashboard').controller('DashboardCtrl', DashboardCtrl);

  /** @ngInject */
  function DashboardCtrl($scope, $http) {

  	console.log("DashboardCtrl!");

    $scope.committmentTableData = [];
    $scope.filter = 0;
    $scope.eventList = [];

    $scope.loadTableData = function() { 
      $http.post('/CommittmentList').then(function(response) {
        // Create the list of event_ids 
        var i;
        for( i=0; i++; i<response.data.records.length) {
          if($scope.eventList.indexOf(response.data.records.event_id)==-1) {
            $scope.eventList.push(response.data.records.event_id);
          }
        }
        // Check to see if a filter is set
        if($scope.filter>0) {
          // Only return the table rows that match the event_id filter
          $scope.committmentTableData=response.data.records.tableFilter();  
        }
        else {
          // No filter, show all of the events in one display
          $scope.committmentTableData=response.data.records;
        }
      })
    };

    $scope.findEvent = function(record) {
      return record.event_id;
    };

    $scope.tableFilter = function(record) {
      // Return only the records for the selected event;
      return record.event_id==$scope.filter;
    };

    $scope.loadTableData();

    $scope.completionAccepted = function(index) {
      console.log("completionAccepted index=", index);
    	// Call REST to close off commitment
      var commitmentRow = $scope.committmentTableData[index];
      var commitment_id = commitmentRow.commitment_id;
      var messenger_id = commitmentRow.messenger_id;
      var eventName = commitmentRow.eventName;
      $http.post('/AcceptCommitmentCompletion?commitmentID=' + commitment_id + "&messengeruserid="+ messenger_id + "&eventName=" + eventName).then(function(response) {
      	console.log("Commitment updated to completionAccepted");
      })
      // Reload table with updated status
      $scope.loadTableData(); 
    };


    $scope.refreshTable = function() {
    	$scope.loadTableData();
    };
  }

})();
