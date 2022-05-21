//import users from '../data/user.js';

import { ManagerMongoDB } from "./../managers/manager-mongodb.js";

let users = new ManagerMongoDB("users");

class User {

    async createUser(user) {
        console.log(`---> userModel::createUser ${user.username}`);
        
        let new_user = await users.createUser(user);
        return new_user;


    }

    async loginUser(user) {
        console.log(`---> userModel::loginUser ${user.username}`);

        let log = await users.loginUser(user);
        return log;
    }

    removeUser(user) {
        const index = users.findIndex(element => element.username == user.username);
        if (index != -1) users.splice(index, 1);
        return index;
    }

}

export default new User();