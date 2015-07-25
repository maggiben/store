'use strict';

import { MasonryController } from "./masonry.controller";
import Masonry from 'masonry-layout';

console.log("MasonryController: ", MasonryController)

class MasonryDirective {
    constructor() {
        this.restrict = 'AE';
        this.controller = MasonryController;
        this.bindToController = true;
        this.controllerAs = 'ctrl';
        this.link = {
            pre: function preLink(scope, element, attrs, ctrl) {
                console.log("CONT: ", MasonryController);

                return;

                var attrOptions = scope.$eval(attrs.masonry || attrs.masonryOptions);
                var options = angular.extend({
                    itemSelector: attrs.itemSelector || '.masonry-brick',
                    columnWidth: parseInt(attrs.columnWidth, 10) || attrs.columnWidth
                }, attrOptions || {});
                //element.masonry(options);
                var masonry = new Masonry(element[0], options);
                var loadImages = scope.$eval(attrs.loadImages);
                ctrl.loadImages = loadImages !== false;
                var preserveOrder = scope.$eval(attrs.preserveOrder);
                ctrl.preserveOrder = (preserveOrder !== false && attrs.preserveOrder !== undefined);
                var reloadOnShow = scope.$eval(attrs.reloadOnShow);
                if (reloadOnShow !== false && attrs.reloadOnShow !== undefined) {
                    scope.$watch(function() {
                        return element.prop('offsetParent');
                    }, function(isVisible, wasVisible) {
                        if (isVisible && !wasVisible) {
                            ctrl.reload();
                        }
                    });
                }

                scope.$emit('masonry.created', element);
                scope.$on('$destroy', ctrl.destroy);
            }
        }
    }

    static directiveFactory(){
        MasonryDirective.instance = new MasonryDirective();
        return MasonryDirective.instance;
    }
}

//MasonryDirective.directiveFactory.$inject = ['MasonryController'];

//export { MasonryDirective }


/*function MasonryDirective() {
    return {
        controller: MasonryController,
        restrict: 'AE',
        bindToController: true,
        controllerAs: 'ctrl',
        link: {
            pre: function preLink(scope, element, attrs, ctrl) {
                //console.log("CONT: ", MasonryController);
            }
        }
    }
}*/

export { MasonryDirective };
