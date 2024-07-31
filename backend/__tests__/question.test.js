import request from "supertest";
import app from "../src/index";
import { UserRepository } from "../src/database/repositories/userRepository";
import { clearDatabase } from "./utils";
import {
    test as testDB
} from '../knexfile.js'
const userData = {
    email: 'test2@gmail.com',
    firstname: 'test',
    lastname: 'tester',
    password: 'testpassword'
}

describe("Question tests", () => {
    beforeAll(async () => {
        await clearDatabase(testDB)
    });

    test("create question", async () => {
        const insertedUser = await UserRepository.registerUser(userData.email, userData.firstname, userData.lastname, userData.password);
        const data = {
            question: "What is 2+2?",
            askedby: insertedUser.id
        }
        const response = await request(app)
            .post('/questions')
            .send(data)
            .expect(201);
        return expect(response => {
            const sameQuestion = response.body.question === data.question;
            const sameAskedBy = response.body.askedby === data.askedby;
            const hasDBId = response.body.id !== undefined;
            return sameQuestion && sameAskedBy && hasDBId;
        }).toBeTruthy();
    })

    test("Create question - no question", () => {
        return request(app)
            .post('/questions')
            .send({
                askedby: 1
            })
            .expect(400);
    })

    test("Create question - invalid user", () => {
        return request(app)
            .post('/questions')
            .send({
                question: "what is 2+2?",
                askedby: -1
            })
            .expect(400);
    })
});