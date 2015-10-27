'use strict';

/* Controllers */

var realTalkApp = angular.module('realTalkApp', []);

realTalkApp.controller('EventListCtrl', ['$scope', '$http', function($scope, $http) {
  $http.get('events.json').success(function(data) {
    $scope.events = data;
  });

  // $scope.orderProp = 'age';
}]);
