import express from 'express'
import { CommentRepository } from '../database/repositories/commentRepository'
import { body, param, validationResult, matchedData } from 'express-validator';

const commentRoutes = express.Router()

commentRoutes.get('/', async (req, res, next) => {
    try {
        const comments =  await CommentRepository.getAll(); 
        return res.send(comments)
    } catch(error) {
        next(error);
    }
    
})

commentRoutes.get('/:id', 
    [
        param('id', 'id has to be an integer').isNumeric().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const comment = await CommentRepository.getById(data.id);
                res.status(200).send(comment);
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch (error) {
            next(error)
        }
    }
)

commentRoutes.post('/', 
    [
        body('comment', 'comment cannot be empty and has to be a string').isString().notEmpty(),
        body('questionId', 'questionId has to be a number and cannot be empty').isNumeric().notEmpty(),
        body('commentedBy', 'commentedBy has to be a number and cannot be empty').isNumeric().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const comment = await CommentRepository.createComment(data.comment, data.questionId, data.commentedBy);
                res.status(201).send(comment);
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch (error) {
            next(error)
        }
    }
)

commentRoutes.delete('/:id', 
    [
        param('id', 'id has to be an integer').isNumeric().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const comment = await CommentRepository.deleteComment(data.id);
                res.status(200).send(comment);
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch (error) {
            next(error)
        }
    }
)

export {
    commentRoutes
}