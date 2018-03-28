'use strict';

PBA.controller('AnalyzeCtrl', ['$scope', 'dataService', 'filterService', function ($scope, dataService, filterService, NgMap) {
    var self = this;
    self.plots = dataService.plots;
    self.selectedPlots = filterService.getSelectedPlots();
    $scope.pieData = dataService.getPieData();
    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyD-zAE8umUUIT3FSoFiFYyChRuR5YsPge0";

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