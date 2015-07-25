import angular from 'angular';
import * as VineModule from './vine/vine.module';
import masonry from 'masonry';

console.log(angular.version);

angular.module('vineyard',[])
.factory('VineService', VineModule.service)
.directive('vineMasonry', function() {
    return function (scope, element, attrs) {
        console.log(masonry)
        var masonry = new Masonry( element[0], {
            itemSelector: '.item',
            columnWidth: 200,
            gutter: 20
        });
        masonry.layout();
    };
})
.directive('vineScroller', VineModule.directive)
.controller('VineController', VineModule.controller);

console.log("endd: ", new VineModule.directive())
