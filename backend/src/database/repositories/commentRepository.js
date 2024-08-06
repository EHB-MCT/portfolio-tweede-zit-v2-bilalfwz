import database from "../database.js";
import { UserRepository } from "./userRepository.js";
export class CommentRepository {
    static async _loadRelationship(comment) {
        const user = await UserRepository.getById(comment.commentedby)
        comment.user = user;
        return comment;
    }

    static async getAll() {
        const comments = await database.table('comment').select();
        for (let comment of comments) {
            comment = await this._loadRelationship(comment)
        }
        return comments
    }

    static async getById(commentId) {
        const comments = await database.table('comment').where({
            id: commentId
        }).select()
        if (comments.length > 0) {
            return this._loadRelationship(comments[0])
        }
        return undefined;
    }
    
    static async getCommentsByQuestionId(questionId) {
        const comments = await database.table('comment').where({
            questionid: questionId
        }).select()
        for (let comment of comments) {
            comment = await this._loadRelationship(comment);
        }
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