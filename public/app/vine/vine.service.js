'use strict';

import angular from 'angular';

class VineService {
    constructor($http){
        this.$http = $http;
    }

    getVine(){
        return this.$http.get('https://api.github.com/users').then(r => r.data);
    }

    static factory($http){
        return new VineService($http);
    }
};

VineService.factory.$inject = ['$http'];

export { VineService }
