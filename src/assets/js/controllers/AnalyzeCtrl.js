'use strict';

PBA.controller('AnalyzeCtrl', ['$scope', 'dataService', 'filterService', 'mapService', 'NgMap', function ($scope, dataService, filterService, mapService, NgMap) {
    var self = this;
    //filter lists
    self.plots = dataService.plots;
    self.bacList = filterService.bac_list;
    self.sexeList = filterService.sexe_list;
    self.boursierList = filterService.boursier_list;
    self.filter = 'all';
    self.mode = '';

    //Google map config
    self.googleMapsKey = mapService.googleMapsKey;
    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=" + self.googleMapsKey;

    //Markers
    $scope.mapPoints = mapService.mapPoints;

    //Data for graphs
    $scope.pieData = dataService.pieData;

    self.getPlotsList = function() {
        return dataService.getPlotsList();
    };

    self.getNbCandidatures = function() {
        return mapService.nbTotalCandidatures;
    };

    //retourne le pourcentage de candidatures par rapport au total
    self.getPercentageFromTotalCandidatures = function (nbCandidature) {
        return (nbCandidature/self.getNbCandidatures()*100).toFixed(2);
    };

    self.debug = function() {
        console.log(self.isMapUpdating())
    };

    //Is called every time you update a filter
    self.refresh = function() {
        filterService.filter = self.filter;
        dataService.update();
        mapService.update(dataService.mapCans);

    };

    //Notifies the user during API call
    self.isMapUpdating = function() {

        if(mapService.ajaxDone !== mapService.currentApiCall){
            return "Informations en cours de mise à jour sur la carte ("+ mapService.MAXCALLPERSEC +" localisations sont chargées par seconde) ...";
        }
        return "Informations de la carte à jour !";

    };

    //Toggle info when a marker is clicked
    self.markerOnClick = function (event, item) {

        if (this.classList.contains('details-map-extended')) {

            this.innerHTML = "<div class=\"details-map ng-binding ng-scope\">" + self.getPercentageFromTotalCandidatures(item.nbCandidatures) +"%</div>";
            this.classList.remove("details-map-extended");
            return;
        }

        var texte = "<div class=\"details-map ng-binding ng-scope\"><p>" + item.cans[0]["Libellé établissement"] + "</p>";
        texte += "<p>" + item.nbCandidatures + " candidats ("+ self.getPercentageFromTotalCandidatures(item.nbCandidatures) +"%)</p>";

        Object.keys(self.bacList).forEach(function (key) {

            var nbCans = mapService.getNbCansFromSerie(item.cans, key);

            if( nbCans !== 0){
               texte += "<p>" + key + " : " + nbCans + " ("+ self.getPercentageFromTotalCandidatures(nbCans) +"%)</p>";
            }
        });

        var cansPerSexe = mapService.getNbCansFromSexe(item.cans);

        texte += "<p>H/F :" + cansPerSexe.M + "/" + cansPerSexe.F + " </p>";
        texte += "<p>Boursiers :" + mapService.getNbCansFromBourse(item.cans) + " </p></div>";

        this.innerHTML = texte;
        this.classList.add("details-map-extended");
    };

    self.setModeGraphique = function() {
        self.mode = 'graphique';
    };

    self.setModeCarte = function() {
        self.mode = 'carte';
    };
}]);