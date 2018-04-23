'use strict';

PBA.service('mapService', function(){

    var self = this;
    self.googleMapsKey = "AIzaSyD-zAE8umUUIT3FSoFiFYyChRuR5YsPge0";
    self.api_status = '';

    self.nbTotalCandidatures = 0;
    self.mapPoints = [];
    self.coordinates = {};

    self.addPoint = function (point, data) {

        self.mapPoints.push({'point':point, 'nbCandidatures': data.length});
    };

    self.addPointFromAddress = function(address, data) {

        // check if we already have this information to avoid calling google' api
        if(self.coordinates[address] !== undefined) {
            self.addPoint(self.coordinates[address], data);
        } else {
            if(self.api_status !== 'OVER_QUERY_LIMIT') {
                $.ajax({
                    url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address+",+CA&key=" + self.googleMapsKey,
                    success: function(result){
                        if(result.status !== 'OVER_QUERY_LIMIT' && result.results[0] !== undefined) {
                            self.coordinates[address] = result.results[0].geometry.location;
                            setTimeout(self.addPoint(result.results[0].geometry.location, data),50);

                        } else {

                            if (result.status === 'OVER_QUERY_LIMIT') {
                                self.api_status = 'OVER_QUERY_LIMIT';
                                console.error('Too much API request');
                            }
                        }
                    }
                });
            } else {
                console.error('yo wtf stop calling this api .. you\'re calling it too much :/')
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
        self.updatePointsFromCans(mapCans);
    };

});