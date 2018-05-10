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

    $scope.loadTableData = function() { 
      $http.post('/CommittmentList').then(function(response) {
        $scope.committmentTableData=response.data.records;
      })
    };

    $scope.loadTableData();

    $scope.completionAccepted = function(index) {
    	// Call REST to close off commitment
      $http.post('/AcceptCommitmentCompletion?commitmentID=' + $scope.committmentTableData[index].commitment_id + "&messengeruserid="+ $scope.committmentTableData[index].messengeruser_id + "&eventName=" + $scope.committmentTableData[index].eventName).then(function(response) {
      	console.log("Commitment updated to completionAccepted");
      })
      // Reload table with updated status
      $scope.loadTableData(); 
    }

  }

})();
