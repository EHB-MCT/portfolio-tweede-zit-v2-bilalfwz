import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors';
import { config } from 'dotenv'
import { userRoutes } from './routes/user.route.js';
import { questionRoutes } from './routes/question.route.js';
import { answerRoutes } from './routes/answer.route.js';

config();

const app = express();
app.use(bodyParser.json())
app.use(cors())

app.use('/users', userRoutes);
app.use('/questions', questionRoutes)
app.use('/answers', answerRoutes)
// Error handler
app.use((error, req, res, next) => {
    return res.status(500).send(error.message)
})

export default app;