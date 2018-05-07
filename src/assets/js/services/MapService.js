'use strict';

PBA.service('mapService', ['$rootScope', function($rootScope){

    var self = this;
    //Info API
    self.googleMapsKey = "AIzaSyB5_m8BKa27lhlK0glps9CxGZbjpeD4eY0";
    self.api_status = '';

    //Markers info
    self.nbTotalCandidatures = 0;
    self.mapPoints = [];
    //Once a destination is geocoded with API, you can get it here
    self.coordinates = {};

    //Get markers from local storage
    if(localStorage.getItem('coordinates')){
        self.coordinates = JSON.parse(localStorage.getItem('coordinates'));
    }

    //Info to get markers from API
    self.MAXCALLPERSEC = 10;
    self.currentApiCall = 0;
    self.ajaxDone = 0;
    self.timeToWait = 0;
    self.isMapUpdating = false;

    //addPoint to print
    self.addPoint = function (point, data) {
        self.mapPoints.push({'point':point, 'nbCandidatures': data.length, 'cans': data});
    };

    //Ajax call to geocode a destination
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

    //Get marker position, if we don't already have it, get it from Google API
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

    //Get total candidates from a bac Serie
    self.getNbCansFromSerie = function(cans, serie){

        var total = 0;

        cans.forEach(function (can) {
            if(serie === can['Série'] || serie === can['Série diplôme (Code)']){
                total++;
            }
        });
        return total;

    };

    //Get total candidates from sex
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

    //Get total boursiers
    self.getNbCansFromBourse = function(cans){

        var total = 0;

        cans.forEach(function (can) {
            if(can['Boursier (Code)'] !== '0' && can['Boursier (Code)'] !== undefined){
                total++;
            }
        });
        return total;

    };

    //update all markers on map
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

    //update informations
    self.update = function (mapCans) {
        self.nbTotalCandidatures = mapCans.nbTotalCandidatures;
        self.updatePointsFromCans(mapCans);
    };

}]);