import request from "supertest";
import app from "../src/index";

describe("Test the root path", () => {
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
            console.log(response.statusCode);
            console.log(response.text);
            return expect(response.body).toBeDefined()
        })
    })
});