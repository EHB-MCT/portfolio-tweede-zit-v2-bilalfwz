import request from "supertest";
import app from "../src/index";
import { UserRepository } from "../src/database/repositories/userRepository";
import { clearDatabase } from "./utils";
import {
    test as testDB
} from '../knexfile.js'
import { QuestionRepository } from "../src/database/repositories/questionRepository.js";
import { AnswserRepository } from "../src/database/repositories/answerRepository.js";
const userData = {
    email: 'test@gmail.com',
    firstname: 'test',
    lastname: 'tester',
    password: 'testpassword'
}

const questionData = {
    question: 'what is 2 + 2 ?'
}

describe("Answers tests", () => {
    let insertedAnswerId = undefined;
    beforeAll(async () => {
        await clearDatabase(testDB)
    });

    test("create answer", async () => {
        const insertedUser = await UserRepository.registerUser(userData.email, userData.firstname, userData.lastname, userData.password);
        const insertedQuestion = await QuestionRepository.createQuestion(questionData.question, insertedUser.id)
        const answer = {
            answer: '4',
            questionId: insertedQuestion.id,
            answeredBy: insertedUser.id,
            correct: true
        }
        const response = await request(app)
            .post('/answers')
            .send(answer)
            .expect(201);

        const sameAnswer = response.body.answer === answer.answer;
        const sameQuestionId = response.body.questionId === answer.questionid;
        const hasDBId = response.body.id !== undefined;
        insertedAnswerId = response.body.id;

        expect(sameAnswer).toBeTruthy();
        expect(sameQuestionId).toBeTruthy();
        expect(hasDBId).toBeTruthy();    
    })

    test("Create answer - no answser", async () => {
        return await request(app)
            .post('/answers')
            .send({
                questionId: 1
            })
            .expect(400);
    })

    test("Create answer - invalid questionId", async () => {
        return await request(app)
            .post('/answers')
            .send({
                answer: '4',
                questionId: -1
            })
            .expect(400);
    })

    test("Create answer - invalid answeredBy", async () => {
        return await request(app)
            .post('/questions')
            .send({
                answer: '4',
                questionId: 1,
                answeredBy: -1
            })
            .expect(400);
    });
        
    test("mark answer as correct", async () => {
        const response = await request(app)
            .put(`/answers/${insertedAnswerId}/correct`)
            .expect(200);
        return expect(response => {
            const isIncorrect = response.body.correct == true;
            return isIncorrect;
        }).toBeTruthy();
    })

    test("mark answer as incorrect", async () => {
        const response = await request(app)
            .put(`/answers/${insertedAnswerId}/incorrect`)
            .expect(200)
        return expect(response => {
            const isIncorrect = response.body.correct == false;
            return isIncorrect;
        }).toBeTruthy();
    })

    test("delete answer", async () => {
        await request(app)
            .delete(`/answers/${insertedAnswerId}`)
            .send()
            .expect(200)
        
        const answer = await AnswserRepository.getById(insertedAnswerId);
        expect(answer === undefined).toBeTruthy();
    })

});