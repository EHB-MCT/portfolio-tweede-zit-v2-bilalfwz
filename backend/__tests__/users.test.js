import request from "supertest";
import app from "../src/index";
import { test as testDB } from "../knexfile";
import { clearDatabase } from "./utils";
import knex from "knex";


describe("Test the root path", () => {
    beforeAll(async () => {
        console.log('running before all')
        await clearDatabase(testDB)
    });
    
    const data = {
        email: 'test2@gmail.com',
        firstname: 'test',
        lastname: 'tester',
        password: 'testpassword'
    }

    test("Create test user", () => {
        return request(app)
        .post('/users/register')
        .send(data)
        .expect(201)
        .then(response => {
            return expect(response => {
                const sameEmail = response.body.email === data.email;
                const sameFirstname = response.body.firstname === data.firstname;
                const sameLastname = response.body.lastname === data.lastname;
                const samePassword = response.body.password === data.password;
                const hasDBId = response.body.id !== undefined;
                return sameEmail && sameFirstname && sameLastname && samePassword && hasDBId;
            }).toBeTruthy()
        })
    })

    test("Check user login", () => {
        return request(app)
        .post('/users/login')
        .send({
            email: 'test@gmail.com',
            password: 'testpassword'
        })
        .expect(200)
        .then(response => {
            return expect(response.body).toBeDefined()
        })
    })
});