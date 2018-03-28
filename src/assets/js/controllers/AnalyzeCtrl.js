'use strict';

PBA.controller('AnalyzeCtrl', ['$scope', 'dataService', function ($scope, dataService) {
    var self = this;
    self.plots = dataService.plots;
    $scope.pieData = dataService.pieData;

    self.getPlotsList = function() {
        return dataService.getPlotsList();
    };

    self.debug = function() {
        console.log($scope.pieData);
    };

    self.refresh = function() {
        dataService.update();
        console.log($scope.pieData)
    };
}]);