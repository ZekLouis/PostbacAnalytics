'use strict';

PBA.controller('AnalyzeCtrl', ['$scope', 'dataService', function ($scope, dataService) {
    var self = this;
    self.plots = dataService.plots;
    $scope.pieData = dataService.getPieData();

    self.getPlotsList = function() {
        return dataService.getPlotsList();
    };

    self.debug = function() {
        console.log(self.plots);
    };
}]);