import database from "../database.js";
import { CommentRepository } from "./commentRepository.js";
import { AnswserRepository } from "./answerRepository.js";
import { UserRepository } from "./userRepository.js";

export class QuestionRepository {
    static async getAllQuestions() {
        let questions = await database.table('question').select();
        for (let question of questions) {
            question = await this._load_relations(question)
        }
        return questions;
    }

    static async _load_relations(question) {
        const comments = await CommentRepository.getCommentsByQuestionId(question.id);
        question.comments = comments;

        const answers = await AnswserRepository.getAnswerByQuestionId(question.id);
        question.answers = answers;

        const user = await UserRepository.getById(question.askedby);
        question.user = user;
        return question;
    }

    static async getById(questionid) {
        const questions = await database.table('question').where({
            id: questionid
        }).select()
        if (questions.length > 0) {
            return this._load_relations(questions[0])
        }
        return undefined;
    }

    static async createQuestion(question, userid) {
        const insertedIds = await database.table('question').insert({
            question,
            askedby: userid
        }).returning('id')
        return await this.getById(insertedIds[0].id);
    }

    static async deleteQuestion(id) {
        await database.table('question').where({
            id
        }).del()
    }
}