(function() {

    'use strict';

    /*
     * Listens to elements that change content and highlights the syntax
     */
    function apiDocsDirective() {
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                page: '@',
                anchor: '@'
            },
            templateUrl: 'app/components/api-docs.directive.html'
        };
    }

    angular.module('insightCharts').directive('apiDocs', apiDocsDirective);
})();
