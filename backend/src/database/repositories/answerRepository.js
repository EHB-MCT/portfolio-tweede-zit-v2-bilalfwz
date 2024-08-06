import database from "../database.js";
import { UserRepository } from "./userRepository.js";

export class AnswserRepository {
    static async _loadRelationship(answer) {
        const user = await UserRepository.getById(answer.answeredby)
        answer.user = user;
        return answer;
    }

    static async getAll() {
        const answers =  await database.table('answer').select();
        for (let answer of answers) {
            answer = await this._loadRelationship(answer)
        }
        return answers
    }

    static async getById(answerId) {
        const answsers = await database.table('answer').where({
            id: answerId
        }).select()
        if (answsers.length > 0) {
            return this._loadRelationship(answsers[0])
        }
        return undefined;
    }
    
    static async getAnswerByQuestionId(questionId) {
        const answers = await database.table('answer').where({
            questionid: questionId
        }).select()
        for (let answer of answers) {
            answer = await this._loadRelationship(answer)
        }
        return answers
    }

    static async markAnswerCorrect(id) {
        await this._updateAnswerStatus(id, true)
        return await this.getById(id)
    }
    
    static async markAnswerIncorrect(id) {
        await this._updateAnswerStatus(id, false)
        return await this.getById(id)
    }

    static async _updateAnswerStatus(id, correct) {
        await database.table('answer').where({
            id
        }).update({
            correct
        })
    }

    static async createAnswer(answer, questionid, answeredby, correct = false) {
        const insertedIds = await database.table('answer').insert({
            answer,
            questionid,
            correct,
            answeredby
        }).returning('id')
        return await this.getById(insertedIds[0].id);
    }

    static async deleteAnswer(id) {
        await database.table('answer').where({
            id
        }).del()
    }
}