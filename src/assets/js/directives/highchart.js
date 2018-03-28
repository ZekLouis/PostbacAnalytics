PBA.directive('highchart', function() {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            title: '@',
            data: '='
        },
        link: function (scope, element) {
            Highcharts.chart(element[0], {
                title: {
                    text: 'Combination chart'
                },
                xAxis: {
                    categories: scope.data.categories
                },
                series: scope.data.data
            });
        }
    };
});