(function() {

    'use strict';

    /*
     * Listens to elements that change content and highlights the syntax
     */
    function codeHighlightDirective() {
        return function (scope) {
            scope.$watch(function () {
                Prism.highlightElement(angular.element('#codeItem')[0]);
            });
        };
    }

    angular.module('insightCharts').directive('codeHighlightRedraw', codeHighlightDirective);
})();
