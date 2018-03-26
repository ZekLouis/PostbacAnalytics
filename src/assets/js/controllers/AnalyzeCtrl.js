'use strict';

PBA.controller('AnalyzeCtrl', ['$scope', 'dataService', 'filterService', function ($scope, dataService, filterService) {
    var self = this;
    self.plots = dataService.plots;
    self.selectedPlots = filterService.getSelectedPlots();
    $scope.pieData = dataService.getPieData();

    self.getPlotsList = function() {
        return dataService.getPlotsList();
    };

    self.getSelectedPlots = function () {
        return filterService.getSelectedPlots();
    };

    self.debug = function() {
        console.log(self.plots);
    };
}]);