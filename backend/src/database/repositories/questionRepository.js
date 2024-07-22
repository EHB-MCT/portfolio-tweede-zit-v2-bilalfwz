import database from "../database.js";

export class QuestionRepository {
    static async getAllQuestions() {
        return await database.table('question').select();
    }

    static async getQuestionById(questionid) {
        const questions = await database.table('question').where({
            id: questionid
        }).select()
        if (questions.length > 0) {
            return questions[0]
        }
        return undefined;
    }

    static async createQuestion(question, userid) {
        const insertedIds = await database.table('question').insert({
            question,
            askedby: userid
        }).returning('id')
        return await this.getQuestionById(insertedIds[0].id);
    }
}