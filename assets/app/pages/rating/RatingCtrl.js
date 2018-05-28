/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('reliablyMe.rating').controller('RatingCtrl', RatingCtrl);

  /** @ngInject */
  function RatingCtrl($scope, $http) {

  	console.log("RatingCtrl!");

    $scope.committmentTableData = [];

    $scope.loadTableData = function() { 
      $http.post('/CommittmentList').then(function(response) {
        $scope.committmentTableData=response.data.records;
      })
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
