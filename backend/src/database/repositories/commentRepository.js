import database from "../database.js";
export class CommentRepository {
    static async getAll() {
        return database.table('comment').select();
    }

    static async getById(commentId) {
        const comments = await database.table('comment').where({
            id: commentId
        }).select()
        if (comments.length > 0) {
            return comments[0]
        }
        return undefined;
    }
    
    static async getCommentsByQuestionId(questionId) {
        const comments = await database.table('comment').where({
            questionid: questionId
        }).select()
        return comments;
    }

    static async createComment(comment, questionid, commentedby) {
        const insertedIds = await database.table('comment').insert({
            comment,
            questionid,
            commentedby,
        }).returning('id')
        return await this.getById(insertedIds[0].id);
    }

    static async deleteComment(id) {
        await database.table('comment').where({
            id
        }).del()
    }

}