import express from 'express'
import { QuestionRepository } from '../database/repositories/questionRepository.js'
import { param, validationResult, matchedData, body } from 'express-validator'

const questionRoutes = express.Router()
questionRoutes.get('/', async (req, res, next) => {
    try {
        const questions = await QuestionRepository.getAllQuestions();
        res.send(questions);
    } catch (error) {
        next(error)
    }
})

questionRoutes.get('/:id',
    [
        param('id', 'id has to be a number').isNumeric().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const question = await QuestionRepository.getById(data.id);
                if (question === undefined) {
                    return res.status(404).send(`Question with id ${data.id} does not exist`)
                }else {
                    return res.send(question);
                }
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch (error) {
            next(error);
        }
    }
);

questionRoutes.post('/', 
    [
        body('question', 'question cannot be empty').notEmpty(),
        body('askedby', 'askedby cannot be emtpy and has to be a number').isNumeric().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const question = await QuestionRepository.createQuestion(data.question, data.askedby);
                res.status(201).send(question);
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch(error) {
            if (error.code && error.code === '23503'){
                // this means foreign key error
                // https://www.postgresql.org/docs/12/errcodes-appendix.html
                return res.status(400).send(`user with given id does not exist`);
            }
            next(error);
        }
    }
)

questionRoutes.delete('/:id',
    [
        param('id', 'id has to be a number').isNumeric().notEmpty()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const question = await QuestionRepository.deleteQuestion(data.id);
                res.status(200).send(question);
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch (error) {
            next(error);
        }
    }
);

export {
    questionRoutes
}