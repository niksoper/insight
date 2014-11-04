(function()
{
    'use strict';

    function MainCtrl ($scope) {
        $scope.title = "InsightJS";

        // Fix to allow dropdown menu to function with a single click
        $('.dropdown-toggle')
            .click(function(e)
            {
                e.preventDefault();
                e.stopPropagation();

                return false;
            });
    }

    angular.module('insightChartsControllers')
        .controller('MainCtrl', ['$scope', MainCtrl]);

}());
