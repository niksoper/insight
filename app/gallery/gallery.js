(function()
{
    'use strict';

    function galleryController($scope, $http, $q)
    {
        $scope.$parent.title = 'InsightJS';
     
        $scope.showGallery = true;

        $scope.currentItem = undefined;

        $scope.setTemplate = function(item) {
            var currentTemplate = $scope.template;
            $scope.template = 'app/gallery/items/' + item.index;
            if ($scope.template !== currentTemplate) {
                $scope.loadCode(item.index).then(function(code) {
                    $scope.displayCode(code);
                });
            }
            $scope.currentItem = item;
        };

        $scope.loadItems = function() {
            $scope.items = [
                {
                    index: 'barchart/index.html',
                    title: 'Awesome bar chart!',
                    thumbnail: 'barchart/thumbnail.png'
                },
                {
                    index: 'interactive/index.html',
                    title: '~ Zooming chart ~',
                    thumbnail: 'interactive/thumbnail.png'
                },
                {
                    index: 'appstore/index.html',
                    title: 'Dynamic Charts',
                    thumbnail: 'appstore/thumbnail.png'
                }
            ];
            $scope.setTemplate($scope.items[0]);
        };

        $scope.loadCode = function(filePath) {
            var deferred = $q.defer();
            $http({method: 'GET', url: 'app/gallery/items/' + filePath, cache: true}).
                success(function(code) {
                    deferred.resolve(code);
                }
            );
            return deferred.promise;
        };

        $scope.displayCode = function(code) {
            angular.element('#gallery-code').text(code);
            Prism.highlightAll();
        };
    }

    angular.module('insightChartsControllers').controller('Gallery', ['$scope', '$http', '$q', galleryController]);
}());
