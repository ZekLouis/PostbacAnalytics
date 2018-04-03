'use strict';

PBA.controller('AnalyzeCtrl', ['$scope', 'dataService', 'filterService', 'mapService', function ($scope, dataService, filterService, mapService) {
    var self = this;
    self.plots = dataService.plots;
    self.bacList = filterService.bac_list;

    self.googleMapsKey = mapService.googleMapsKey;
    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=" + self.googleMapsKey;
    $scope.mapPoints = mapService.mapPoints;

    $scope.pieData = dataService.pieData;

    self.getPlotsList = function() {
        return dataService.getPlotsList();
    };

    self.debug = function() {
        console.log(self.bacList);
    };

    self.refresh = function() {

        dataService.update();
        mapService.update(dataService.mapCans);
    };
}]);