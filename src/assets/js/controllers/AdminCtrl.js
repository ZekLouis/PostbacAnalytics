'use strict';

PBA.controller('AdminCtrl', ['$scope', 'dataService', function ($scope, dataService) {
    var self = this;
    self.plots = dataService.plots;
    self.loading = false;

    $scope.uploadFile = function(element) {
        var reader = new FileReader();
        var files = element.files;
        var name = '';
        self.loading = true;

        // event on reader load -> load "lots" in the service
        reader.onload = function() {
            Papa.parse(reader.result, {
                header: true,
                complete: function(results) {
                    self.loading = false;
                    if (results.data.length > 0) {
                        var new_plot = {
                            name: name,
                            data: results.data,
                            selected: 0
                        };
                        dataService.addNewPlot(new_plot);
                        element.value = '';

                        $scope.$apply();
                    } else {
                        console.log('Error during import :', results.errors)
                    }
                }
            })
        };

        // if a file is selected -> read it
        if (files.length > 0){
            name = files[0].name;
            reader.readAsText(files[0]);
        } else {
            console.log('file not selected');
        }        
    };
}]);