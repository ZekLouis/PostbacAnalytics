'use strict';

PBA.controller('AnalyzeCtrl', ['$scope', 'dataService', 'filterService', 'mapService', 'NgMap', function ($scope, dataService, filterService, mapService, NgMap) {
    var self = this;
    self.plots = dataService.plots;
    self.bacList = filterService.bac_list;
    self.filter = 'all';

    self.googleMapsKey = mapService.googleMapsKey;
    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=" + self.googleMapsKey;
    $scope.mapPoints = mapService.mapPoints;

    $scope.pieData = dataService.pieData;

    self.getPlotsList = function() {
        return dataService.getPlotsList();
    };

    self.getNbCandidatures = function() {
        return mapService.nbTotalCandidatures;
    };

    self.getPercentageFromTotalCandidatures = function (nbCandidature) {
        return (nbCandidature/self.getNbCandidatures()*100).toFixed(2);
    };

    self.debug = function() {
        console.log(filterService.filter)
    };

    self.refresh = function() {
        filterService.filter = self.filter;
        dataService.update();
        mapService.update(dataService.mapCans);

    };

    self.ctrlConsole = function (event, item) {
        console.log(item);

        this.innerHTML = item.nbCandidatures;
    }
}]);