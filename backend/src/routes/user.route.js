import express from 'express'
import { body, validationResult, matchedData } from 'express-validator'
import { UserRepository } from '../database/repositories/userRepository.js';

const userRoutes = express.Router()

userRoutes.post('/register',
    [
        body('email', 'email cannot be empty').notEmpty(),
        body('email', 'email has to be a valid email address').isEmail(),
        body('firstname', 'firstname cannot be empty').notEmpty(),
        body('lastname', 'lastname cannot be empty').notEmpty(),
        body('password', 'password cannot be empty').notEmpty()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const user = await UserRepository.registerUser(data.email, data.firstname, data.lastname, data.password);
                return res.status(201).send(user);
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch (error) {
            next(error);
        }
    }
)

userRoutes.post('/login',
    [
        body('email', 'email cannot be empty').notEmpty(),
        body('password', 'password cannot be empty').notEmpty()
    ],
    async (req, res, next) => {
        try {
            const result = validationResult(req);
            if (result.isEmpty()) {
                const data = matchedData(req);
                const user = await UserRepository.checkLogin(data.email, data.password);
                return res.status(200).send(user);
            } else {
                return res.status(400).send(result.errors.map(error => error.msg).join("\n"))
            }
        } catch (error) {
            next(error);
        }
    }
)

export {
    userRoutes
}