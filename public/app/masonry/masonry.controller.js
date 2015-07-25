'use strict';
import Masonry from 'masonry-layout';

class MasonryController {
    constructor(Masonry, $timeout) {
        this.masonry = Masonry;
        this.$timeout = $timeout;

        this.bricks = {};
        this.schedule = [];
        this.destroyed = false;
        this.timeout = null;

        this.preserveOrder = false;
        this.loadImages = true;
        console.log("mew")
    }

    scheduleMasonryOnce() {
        var args = arguments;
        var found = this.schedule.filter(function filterFn(item) {
            return item[0] === args[0];
        }).length > 0;

        if (!found) {
            this.scheduleMasonry.apply(null, arguments);
        }
    }
    defaultLoaded($element) {
        $element.addClass('loaded');
    }
    appendBrick(element, id) {
        if (destroyed) {
            return;
        }

        function _append() {
            if (Object.keys(bricks).length === 0) {
                //$element.masonry('resize');
            }
            if (bricks[id] === undefined) {
                // Keep track of added elements.
                bricks[id] = true;
                defaultLoaded(element);
                //$element.masonry('appended', element, true);
            }
        }

        function _layout() {
            // I wanted to make this dynamic but ran into huuuge memory leaks
            // that I couldn't fix. If you know how to dynamically add a
            // callback so one could say <masonry loaded="callback($element)">
            // please submit a pull request!
            self.scheduleMasonryOnce('layout');
        }

        if (!self.loadImages) {
            _append();
            _layout();
        } else if (self.preserveOrder) {
            _append();
            element.imagesLoaded(_layout);
        } else {
            element.imagesLoaded(function imagesLoaded() {
                _append();
                _layout();
            });
        }
    }

    removeBrick(id, element) {
        if (destroyed) {
            return;
        }

        delete bricks[id];
        //$element.masonry('remove', element);
        this.scheduleMasonryOnce('layout');
    }

    destroy() {
        destroyed = true;

        if ($element.data('masonry')) {
            // Gently uninitialize if still present
            //$element.masonry('destroy');
        }
        $scope.$emit('masonry.destroyed');

        bricks = {};
    }

    reload() {
        //$element.masonry();
        $scope.$emit('masonry.reloaded');
    };
}

MasonryController.$inject = ['Masonry', '$timeout'];

export { MasonryController }
