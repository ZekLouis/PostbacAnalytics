'use strict';

PBA.service('mapService', function(){

    var self = this;
    self.googleMapsKey = "AIzaSyD-zAE8umUUIT3FSoFiFYyChRuR5YsPge0";

    self.mapPoints = [];

    self.addPoint = function (point) {
        self.mapPoints.push(point);
    };

    self.addPointFromAdress = function(address) {
        $.ajax({url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address+",+CA&key=" + self.googleMapsKey, success: function(result){
                self.addPoint(result.results[0].geometry.location);
            }});
    };
    
    self.updatePointsFromPlots = function (plots, map) {

        plots.forEach(function (plot) {

            plot.data.forEach(function (student) {
                self.addPointFromAdress(student['Libellé établissement']);
            });
        });
        google.maps.event.trigger(map,'resize')

    }

});