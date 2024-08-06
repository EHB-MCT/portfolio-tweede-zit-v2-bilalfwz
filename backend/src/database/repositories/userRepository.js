import database from "../database.js";

export class UserRepository {
    static async getById(id) {
        let user = await database('users').where({
            id: id
        }).select();
        if (user.length > 0) {
            user = user[0];
            delete user['password'];
            console.log(user);
            return user
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
        return await this.getById(insertedId);
    }

    static async deleteUser(id) {
        await database.table('users').where({
            id
        }).del()
    }
}