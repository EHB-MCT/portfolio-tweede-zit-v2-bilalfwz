import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors';
import { config } from 'dotenv'
import { userRoutes } from './routes/user.route.js';
import { questionRoutes } from './routes/question.route.js';

config();

const app = express();
app.use(bodyParser.json())
app.use(cors())

app.use('/users', userRoutes);
app.use('/questions', questionRoutes)
// Error handler
app.use((error, req, res, next) => {
    console.log(error)
    console.log(error.code)
    return res.status(500).send(error.message)
})

export default app;