'use strict';

PBA.service('mapService', function(){

    var self = this;
    self.googleMapsKey = "AIzaSyB5_m8BKa27lhlK0glps9CxGZbjpeD4eY0";
    self.api_status = '';

    self.nbTotalCandidatures = 0;
    self.mapPoints = [];
    self.coordinates = {};

    self.MAXCALLPERSEC = 10;
    self.currentApiCall = 0;
    self.ajaxDone = 0;
    self.timeToWait = 0;

    self.addPoint = function (point, data) {
        self.mapPoints.push({'point':point, 'nbCandidatures': data.length});
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
                }

            }
        });
    };

    self.addPointFromAddress = function(address, data) {

        // check if we already have this information to avoid calling google' api
        if(self.coordinates[address] !== undefined) {
            self.addPoint(self.coordinates[address], data);
        } else {
            if(self.currentApiCall < 20){
                self.currentApiCall ++;

                if(self.currentApiCall % self.MAXCALLPERSEC === self.MAXCALLPERSEC-1){
                    self.timeToWait += 1000;
                }
                setTimeout(function() {
                    self.callApi(address, data);
                },self.timeToWait);
            }
        }
    };
    
    self.updatePointsFromCans = function (mapCans) {

        while(self.mapPoints.length > 0) {
            self.mapPoints.pop();
        }
        Object.keys(mapCans.lycees).forEach(function (key) {

            if(self.api_status !== 'OVER_QUERY_LIMIT') {
                self.addPointFromAddress(key, mapCans.lycees[key]);
            }
        });
    };

    self.update = function (mapCans) {
        self.nbTotalCandidatures = mapCans.nbTotalCandidatures;
        // REMI
        // self.updatePointsFromCans(mapCans);
    };

});