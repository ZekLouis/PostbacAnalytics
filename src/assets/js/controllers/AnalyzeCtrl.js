'use strict';

PBA.controller('AnalyzeCtrl', ['$scope', 'dataService', 'filterService', 'mapService', function ($scope, dataService, filterService, mapService, NgMap) {
    var self = this;
    self.plots = dataService.plots;
    self.selectedPlots = filterService.getSelectedPlots();
    $scope.pieData = dataService.pieData;

    self.googleMapsKey = mapService.googleMapsKey;
    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=" + self.googleMapsKey;
    $scope.mapPoints = mapService.mapPoints;

    self.getPlotsList = function() {
        return dataService.getPlotsList();
    };

    self.getSelectedPlots = function () {
        return filterService.getSelectedPlots();
    };

    self.debugMap = function () {
        mapService.updatePointsFromPlots(self.plots, NgMap);
    };

    self.debug = function() {
        console.log($scope.pieData);
    };

    self.refresh = function() {
        dataService.update();
    };
}]);