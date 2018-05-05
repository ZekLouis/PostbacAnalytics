'use strict';

PBA.service('mapService', ['$rootScope', 'NgMap', function($rootScope, NgMap){

    var self = this;
    self.googleMapsKey = "AIzaSyB5_m8BKa27lhlK0glps9CxGZbjpeD4eY0";
    self.api_status = '';

    self.nbTotalCandidatures = 0;
    self.mapPoints = [];

    self.coordinates = {};

    if(localStorage.getItem('coordinates')){
        self.coordinates = JSON.parse(localStorage.getItem('coordinates'));
    }

    self.markerClusterer = null;


    self.MAXCALLPERSEC = 10;
    self.currentApiCall = 0;
    self.ajaxDone = 0;
    self.timeToWait = 0;
    self.isMapUpdating = false;

    self.addPoint = function (point, data) {
        self.mapPoints.push({'point':point, 'nbCandidatures': data.length, 'cans': data});
    };

    self.callApi = function (address, data) {
        $.ajax({
            url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address+",+CA&key=" + self.googleMapsKey,
            success: function(result){

                self.ajaxDone ++;

                if(result.status !== 'OVER_QUERY_LIMIT' && result.results[0] !== undefined) {
                    self.coordinates[address] = result.results[0].geometry.location;
                    self.addPoint(result.results[0].geometry.location, data);
                } else {

                    if (result.status === 'OVER_QUERY_LIMIT') {
                        self.api_status = 'OVER_QUERY_LIMIT';
                        console.error(result.error_message);
                    }
                }

                if(self.ajaxDone === self.currentApiCall){

                    console.log("chargement finis :)");

                    self.currentApiCall = 0;
                    self.ajaxDone = 0;
                    self.timeToWait = 0;
                    self.isMapUpdating = false;
                    $rootScope.$apply();
                    localStorage.setItem('coordinates', JSON.stringify(self.coordinates));
                }

            }
        });
    };

    //update du clusterer
    self.updateClusterer = function (){

        NgMap.getMap().then(function(map) {
            self.dynMarkers = [];
            var bounds = new google.maps.LatLngBounds();
            for (var k in map.customMarkers) {
                var cm = map.customMarkers[k];
                self.dynMarkers.push(cm);
            }
            self.markerClusterer = new MarkerClusterer(map, self.dynMarkers, {
                maxZoom: 15,
                imagePath: 'assets/images/cluster/m'
            });
        });
    };

    self.addPointFromAddress = function(address, data) {

        // check if we already have this information to avoid calling google' api
        if(self.coordinates[address] !== undefined) {
            self.addPoint(self.coordinates[address], data);
        } else {
            self.currentApiCall ++;

            if(self.currentApiCall % self.MAXCALLPERSEC === self.MAXCALLPERSEC-1){
                self.timeToWait += 1000;
            }
            setTimeout(function() {
                self.callApi(address, data);
            },self.timeToWait);
        }
    };

    self.getNbCansFromSerie = function(cans, serie){

        var total = 0;

        cans.forEach(function (can) {
            if(serie === can['Série'] || serie === can['Série diplôme (Code)']){
                total++;
            }
        });
        return total;

    };

    self.getNbCansFromSexe = function(cans){

        var totalM = 0;
        var totalF = 0;

        cans.forEach(function (can) {
            if(can['Sexe'] === 'M'){
                totalM++;
            }
            if(can['Sexe'] === 'F'){
                totalF++;
            }
        });
        return {'M' : totalM, 'F' : totalF};

    };

    self.getNbCansFromBourse = function(cans){

        var total = 0;

        cans.forEach(function (can) {
            if(can['Boursier (Code)'] !== '0' && can['Boursier (Code)'] !== undefined){
                total++;
            }
        });
        return total;

    };
    
    self.updatePointsFromCans = function (mapCans) {

        while(self.mapPoints.length > 0) {
            self.mapPoints.pop();
        }

        Object.keys(mapCans.lycees).forEach(function (key) {

            var commune = mapCans.lycees[key][0]['Commune établissement'];
            var pays = mapCans.lycees[key][0]['Pays établissement'];

            //si pas de lycee
            if(key ===''){
                return;
            }

            self.addPointFromAddress(key + ' ' + commune + ' ' + pays, mapCans.lycees[key]);

        });
        self.isMapUpdating = true;

    };

    self.update = function (mapCans) {
        self.nbTotalCandidatures = mapCans.nbTotalCandidatures;
        self.updatePointsFromCans(mapCans);
        self.updateClusterer();
    };

}]);