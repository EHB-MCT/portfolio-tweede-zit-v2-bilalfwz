import database from "../database.js";

export class AnswserRepository {
    static async getAll() {
        return await database.table('answer').select();
    }

    static async getById(answerId) {
        const answsers = await database.table('answer').where({
            id: answerId
        }).select()
        if (answsers.length > 0) {
            return answsers[0]
        }
        return undefined;
    }
    
    static async getAnswerByQuestionId(questionId) {
        const answers = await database.table('answer').where({
            questionid: questionId
        }).select()
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