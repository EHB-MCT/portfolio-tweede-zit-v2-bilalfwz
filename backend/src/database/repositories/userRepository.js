import database from "../database.js";

export class UserRepository {
    static async getUserById(id) {
        const user = await database('users').where({
            id: id
        }).select();
        if (user.length > 0) {
            return user[0]
        }
        return undefined;
    }


    static async checkLogin(email, password) {
        const users = await database('users').where({
            email: email,
            password: password 
        }).select();
        if (users.length > 0) {
            return users[0]
        }
        return undefined;
    }

    static async registerUser(email, firstname, lastname, password) {
        const insertedUsers = await database('users').insert({
            email,
            firstname,
            lastname,
            password
        }).returning('id');
        const insertedId = insertedUsers[0].id;
        return await this.getUserById(insertedId);
    }
}