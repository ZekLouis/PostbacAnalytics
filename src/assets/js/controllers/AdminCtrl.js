'use strict';

PBA.controller('AdminCtrl', ['$scope', 'dataService', function ($scope, dataService) {
    var self = this;

    $scope.uploadFile = function(element) {
        //console.log(element);
        var files = element.files;
        var reader = new FileReader();

        reader.onload = function() {
            Papa.parse(reader.result, {
                header: true,
                complete: function(results) {
                    console.log('Parsed', results);
                }
            })
        };

        reader.readAsText(files[0])
    }
}]);