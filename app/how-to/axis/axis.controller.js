(function()
{
    'use strict';

    function HowToAxisController ($scope, $location, $anchorScroll, $timeout) {
        $scope.$parent.title = 'How To Guides For An Axis';

        $scope.scrollTo = function (id) {
            $location.hash(id);
            $anchorScroll();
        };

        // to-do think of a better way - maybe find last loading element?
        $timeout(function(){
            Prism.highlightAll();
        }, 200);
    }

    angular.module('insightChartsControllers').controller('HowToAxisController', ['$scope', '$location', '$anchorScroll', '$timeout', HowToAxisController]);
}());
