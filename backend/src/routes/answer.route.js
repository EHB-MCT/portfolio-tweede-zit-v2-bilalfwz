import express from 'express'
import { AnswserRepository } from '../database/repositories/answerRepository.js'
import { param, validationResult, matchedData, body } from 'express-validator'

const answerRoutes = express.Router()
answerRoutes.get('/', async (req, res, next) => {
    try {
        const answers = await AnswserRepository.getAll()
        res.send(answers);
    } catch (error) {
        next(error)
    }
})

answerRoutes.get('/:id',
    [
        param('id', 'id has to be a number').isNumeric()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const answer = await AnswserRepository.getAnswerById(data.id);
                if (answer === undefined) {
                    return res.status(404).send(`Answer with id ${data.id} does not exist`)
                }else {
                    return res.send(answer);
                }
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch (error) {
            next(error);
        }
    }
);

answerRoutes.put('/:id/correct', 
    [
        param('id', 'id has to be a number').isNumeric()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const answer = await AnswserRepository.markAnswerCorrect(data.id);
                res.status(200).send(answer);
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch(error) {
            next(error);
        }
    }
)

answerRoutes.put('/:id/incorrect', 
    [
        param('id', 'id has to be a number').isNumeric()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const answer = await AnswserRepository.markAnswerIncorrect(data.id);
                res.status(200).send(answer);
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch(error) {
            next(error);
        }
    }
)

answerRoutes.post('/', 
    [
        body('answer', 'answer cannot be empty').notEmpty(),
        body('questionId', 'questionId cannot be emtpy and has to be a number').isNumeric().notEmpty(),
        body('answeredBy', 'answeredBy cannot be empty').isNumeric().notEmpty(),
        body('correct', 'correct has to be boolean').isBoolean()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const answer = await AnswserRepository.createAnswer(data.answer, data.questionId, data.answeredBy, data.correct);
                res.status(201).send(answer);
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch(error) {
            if (error.code && error.code === '23503'){
                // this means foreign key error
                // https://www.postgresql.org/docs/12/errcodes-appendix.html
                return res.status(400).send(`question with given id does not exist`);
            }
            next(error);
        }
    }
)

export {
    answerRoutes
}