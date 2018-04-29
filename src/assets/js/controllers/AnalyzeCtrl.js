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

        var texte = "<p>" + item.cans[0]["Libellé établissement"] + "</p>";
        texte += "<p>" + item.nbCandidatures + " candidats ("+ self.getPercentageFromTotalCandidatures(item.nbCandidatures) +"%)</p>";

        Object.keys(self.bacList).forEach(function (key) {

            var nbCans = mapService.getNbCansFromSerie(item.cans, key);

            if( nbCans !== 0){
               texte += "<p>" + key + " : " + nbCans + " ("+ self.getPercentageFromTotalCandidatures(nbCans) +"%)</p>";
            }
        });

        var cansPerSexe = mapService.getNbCansFromSexe(item.cans);

        texte += "<p>H/F :" + cansPerSexe.M + "/" + cansPerSexe.F + " </p>";
        texte += "<p>Boursiers :" + mapService.getNbCansFromBourse(item.cans) + " </p>";

        this.innerHTML = texte;

        this.classList.add("details-map-extended");
    }
}]);