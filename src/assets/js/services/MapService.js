'use strict';

PBA.service('mapService', function(){

    var self = this;
    self.googleMapsKey = "AIzaSyD-zAE8umUUIT3FSoFiFYyChRuR5YsPge0";
    self.api_status = '';

    self.mapPoints = [];
    self.coordinates = {};

    self.addPoint = function (point) {
        self.mapPoints.push(point);
    };

    self.addPointFromAddress = function(address) {
        // check if we already have this information to avoid calling google' api
        if(self.coordinates[address] !== undefined) {
            self.addPoint(self.coordinates[address]);
        } else {
            if(self.api_status !== 'OVER_QUERY_LIMIT') {
                $.ajax({
                    url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address+",+CA&key=" + self.googleMapsKey,
                    success: function(result){
                        if(result.status !== 'OVER_QUERY_LIMIT' && result.results[0] !== undefined) {
                            self.coordinates[address] = result.results[0].geometry.location;
                            self.addPoint(result.results[0].geometry.location);

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
        mapCans.forEach(function (can) {
                if(self.api_status !== 'OVER_QUERY_LIMIT') {
                    self.addPointFromAddress(can['Libellé établissement']);
                }
            });
    };

    self.update = function (mapCans) {
        self.updatePointsFromCans(mapCans);
    };

});