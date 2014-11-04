(function() {

    'use strict';

    /*
     * Listens to elements that change content and highlights the syntax
     */
    function howToGuideDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                page: '@'
            },
            templateUrl: 'app/components/how-to-guide.directive.html'
        };
    }

    angular.module('insightCharts').directive('howToGuide', howToGuideDirective);
})();
