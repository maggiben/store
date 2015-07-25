'use strict';

class VineController {
    constructor(VineService) {
        this.vineService = VineService;
        this.init();
    }

    init(){
        this.vineService.getVine().then(users => {
            this.users = users;
            console.log(users);
        });
    }

    scroll() {
        console.log("scroll");
        this.users.push({
            login: "asdfasdf" + Math.random(),
            avatar_url: "https://avatars.githubusercontent.com/u/1?v=3"
        })
    }
}

VineController.$inject = ['VineService'];

export { VineController }
