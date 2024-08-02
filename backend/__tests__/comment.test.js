import request from "supertest";
import app from "../src/index";
import { UserRepository } from "../src/database/repositories/userRepository";
import { clearDatabase } from "./utils";
import {
    test as testDB
} from '../knexfile.js'
import { QuestionRepository } from "../src/database/repositories/questionRepository.js";
import { CommentRepository } from "../src/database/repositories/commentRepository.js";

const userData = {
    email: 'test@gmail.com',
    firstname: 'test',
    lastname: 'tester',
    password: 'testpassword'
}

const questionData = {
    question: 'what is 2 + 2 ?'
}

describe("Comments tests", () => {
    let insertedCommentId = undefined;
    beforeAll(async () => {
        await clearDatabase(testDB)
    });

    test("create comment", async () => {
        const insertedUser = await UserRepository.registerUser(userData.email, userData.firstname, userData.lastname, userData.password);
        const insertedQuestion = await QuestionRepository.createQuestion(questionData.question, insertedUser.id)
        const comment = {
            comment: 'I\'m thinking 4',
            questionId: insertedQuestion.id,
            commentedBy: insertedUser.id
        }
        const response = await request(app)
            .post('/comments')
            .send(comment)
            .expect(201);

        const sameComment = response.body.comment === comment.comment;
        const sameQuestionId = response.body.questionid === comment.questionId;
        const sameCommentedById = response.body.commentedby === comment.commentedBy
        const hasDBId = response.body.id !== undefined;
        insertedCommentId = response.body.id;

        expect(sameComment).toBeTruthy();
        expect(sameQuestionId).toBeTruthy();
        expect(sameCommentedById).toBeTruthy();
        expect(hasDBId).toBeTruthy();    
    })

    test("Create comment - no comment", async () => {
        return await request(app)
            .post('/comments')
            .send({
                questionId: 1,
                commentedBy: 1
            })
            .expect(400);
    })

    test("Create comment - invalid questionId", async () => {
        return await request(app)
            .post('/answers')
            .send({
                comment: 'I\'m thinking 4',
                questionId: -1,
                commentedBy: 1
            })
            .expect(400);
    })

    test("Create comment - invalid commentedBy", async () => {
        return await request(app)
            .post('/questions')
            .send({
                comment: 'I\'m thinking 4',
                questionId: 1,
                commentedBy: -1
            })
            .expect(400);
    });

    test("Delete comment", async () => {
        const response = await request(app)
            .delete(`/comments/${insertedCommentId}`)
            .send()
            .expect(200)

        const comment = await CommentRepository.getById(insertedCommentId);
        expect(comment === undefined).toBeTruthy();
    })

});