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

    $scope.completionAccepted = function(commitment_id) {
    	// Call REST to close off commitment
      $http.post('/AcceptCommitmentCompletion?commitmentID=' + commitment_id).then(function(response) {
      	console.log("Commitment updated to completionAccepted");
      })
      // Reload table with updated status
      $scope.loadTableData(); 
    }

  }

})();
