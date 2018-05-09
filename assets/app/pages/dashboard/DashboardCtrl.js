/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('reliablyMe.dashboard').controller('DashboardCtrl', DashboardCtrl);

  /** @ngInject */
  function DashboardCtrl($scope) {

  	console.log("DashboardCtrl!");

    $scope.committmentTableData = [];

    $scope.loadTableData = function() { 
      $http.post(APP_DNS+'/CommittmentList').then(function(response) {
        $scope.smartTableData=response.data.records;
      })
    };

    $scope.loadTableData();

  }

})();
