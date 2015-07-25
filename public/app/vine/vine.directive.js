'use strict';

class VineDirective {
    constructor(VineService, $q) {
        this.restrict = 'AE';
        this.$q = $q;
    }

    link(scope, element, attrs) {
        console.log("directive link")
        window.addEventListener('scroll', function() {
            if (document.body.scrollTop >= (document.body.scrollHeight - 800)) {
                scope.$apply(attrs.vineScroller);
            }
        });
    }

    static directiveFactory(VineService, $q){
        VineDirective.instance = new VineDirective(VineService, $q);
        return VineDirective.instance;
    }
}

VineDirective.directiveFactory.$inject = ['VineService', '$q'];

export { VineDirective }
