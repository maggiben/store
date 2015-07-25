import angular from 'angular';
import * as VineModule from './vine/vine.module';
//import * as MasonryModule from './masonry/masonry.module';
import Masonry from 'masonry-layout';

console.log(angular.version);

angular.module('vineyard', ['mo.masonry'])
.factory('VineService', VineModule.service)
/*.directive('vineMasonry', function() {
    return function (scope, element, attrs) {
        var masonry = new Masonry( element[0], {
            itemSelector: '.item',
            columnWidth: 200,
            gutter: 20
        });
        masonry.layout();
    };
})*/
.directive('vineScroller', VineModule.directive)
.controller('VineController', VineModule.controller);

//angular.module('wo.masonry', [])
//.directive('masonry', MasonryModule.directive)

angular.module('mo.masonry', [])
.directive('masonry', function($timeout) {
    return {
        restrict: 'AC',
        link: function(scope, elem, attrs) {
            var container = elem[0];
            var options = angular.extend({
                itemSelector: '.item',
                //gutter: 20,
                percentPosition: true
            }, angular.fromJson(attrs.masonry));

            console.log("do emlem")
            var masonry = scope.masonry = new Masonry(container, options);

            var debounceTimeout = 0;
            scope.update = function() {
                if (debounceTimeout) {
                    $timeout.cancel(debounceTimeout);
                }
                debounceTimeout = $timeout(function() {
                    debounceTimeout = 0;

                    masonry.reloadItems();
                    masonry.layout();

                    elem.children(options.itemSelector).css('visibility', 'visible');
                }, 120);
            };

            scope.removeBrick = function() {
                $timeout(function() {
                    masonry.reloadItems();
                    masonry.layout();
               }, 500);
            };

            scope.appendBricks = function(ele) {
                masonry.appended(ele);
            };

            scope.$on('masonry.layout', function() {
                masonry.layout();
            });

            scope.update();
        }
    };
})
.directive('masonryTile', function() {
    return {
        restrict: 'AC',
        link: function(scope, elem) {
            elem.css('visibility', 'hidden');
            var master = elem.parent('*[masonry]:first').scope(),
                update = master.update,
                removeBrick = master.removeBrick,
                appendBricks = master.appendBricks;
            if (update) {
                //imagesLoaded( elem.get(0), update);
                elem.ready(update);
            }
            if (appendBricks) {
                //imagesLoaded( elem.get(0), appendBricks(elem));
            }
            scope.$on('$destroy', function() {
                if (removeBrick) {
                    removeBrick();
                }
            });
        }
    };
});

/*angular.module('wu.masonry', [])
.controller('MasonryCtrl', function controller($scope, $element, $timeout) {
  var bricks = {};
  var schedule = [];
  var destroyed = false;
  var self = this;
  var timeout = null;

  this.preserveOrder = false;
  this.loadImages = true;

  this.scheduleMasonryOnce = function scheduleMasonryOnce() {
    var args = arguments;
    var found = schedule.filter(function filterFn(item) {
      return item[0] === args[0];
    }).length > 0;

    if (!found) {
      this.scheduleMasonry.apply(null, arguments);
    }
  };

  // Make sure it's only executed once within a reasonable time-frame in
  // case multiple elements are removed or added at once.
  this.scheduleMasonry = function scheduleMasonry() {
    if (timeout) {
      $timeout.cancel(timeout);
    }

    schedule.push([].slice.call(arguments));

    timeout = $timeout(function runMasonry() {
      if (destroyed) {
        return;
      }
      schedule.forEach(function scheduleForEach(args) {
        $element.masonry.apply($element, args);
      });
      schedule = [];
    }, 30);
  };

  function defaultLoaded($element) {
    $element.addClass('loaded');
  }

  this.appendBrick = function appendBrick(element, id) {
    if (destroyed) {
      return;
    }

    function _append() {
      if (Object.keys(bricks).length === 0) {
        $element.masonry('resize');
      }
      if (bricks[id] === undefined) {
        // Keep track of added elements.
        bricks[id] = true;
        defaultLoaded(element);
        $element.masonry('appended', element, true);
      }
    }

    function _layout() {
      // I wanted to make this dynamic but ran into huuuge memory leaks
      // that I couldn't fix. If you know how to dynamically add a
      // callback so one could say <masonry loaded="callback($element)">
      // please submit a pull request!
      self.scheduleMasonryOnce('layout');
    }

    if (!self.loadImages){
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
  };

  this.removeBrick = function removeBrick(id, element) {
    if (destroyed) {
      return;
    }

    delete bricks[id];
    $element.masonry('remove', element);
    this.scheduleMasonryOnce('layout');
  };

  this.destroy = function destroy() {
    destroyed = true;

    if ($element.data('masonry')) {
      // Gently uninitialize if still present
      $element.masonry('destroy');
    }
    $scope.$emit('masonry.destroyed');

    bricks = {};
  };

  this.reload = function reload() {
    $element.masonry();
    $scope.$emit('masonry.reloaded');
  };
}).directive('masonry', function masonryDirective() {
  return {
    restrict: 'AE',
    controller: 'MasonryCtrl',
    link: {
      pre: function preLink(scope, element, attrs, ctrl) {
        var attrOptions = scope.$eval(attrs.masonry || attrs.masonryOptions);
        var options = angular.extend({
          itemSelector: attrs.itemSelector || '.masonry-brick',
          columnWidth: parseInt(attrs.columnWidth, 10) || attrs.columnWidth
        }, attrOptions || {});
        element.masonry(options);
        var loadImages = scope.$eval(attrs.loadImages);
        ctrl.loadImages = loadImages !== false;
        var preserveOrder = scope.$eval(attrs.preserveOrder);
        ctrl.preserveOrder = (preserveOrder !== false && attrs.preserveOrder !== undefined);
        var reloadOnShow = scope.$eval(attrs.reloadOnShow);
        if (reloadOnShow !== false && attrs.reloadOnShow !== undefined) {
          scope.$watch(function () {
            return element.prop('offsetParent');
          }, function (isVisible, wasVisible) {
            if (isVisible && !wasVisible) {
              ctrl.reload();
            }
          });
        }

        scope.$emit('masonry.created', element);
        scope.$on('$destroy', ctrl.destroy);
      }
    }
  };
}).directive('masonryBrick', function masonryBrickDirective() {
  return {
    restrict: 'AC',
    require: '^masonry',
    scope: true,
    link: {
      pre: function preLink(scope, element, attrs, ctrl) {
        var id = scope.$id, index;

        ctrl.appendBrick(element, id);
        element.on('$destroy', function () {
          ctrl.removeBrick(id, element);
        });

        scope.$on('masonry.reload', function () {
          ctrl.scheduleMasonryOnce('reloadItems');
          ctrl.scheduleMasonryOnce('layout');
        });

        scope.$watch('$index', function () {
          if (index !== undefined && index !== scope.$index) {
            ctrl.scheduleMasonryOnce('reloadItems');
            ctrl.scheduleMasonryOnce('layout');
          }
          index = scope.$index;
        });
      }
    }
  };
});*/
