import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import ExperimentRouter from "./routes/experiment.routes.js";
import { listenForResults } from "./utils/queue.utils.js";
import experimentService from "./services/experiment.service.js";

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send({ message: 'ok' })
});

// use nested routes
app.use('/experiment', ExperimentRouter);

const startListeners = async () => {
    console.log('Starting listeners...')

    await listenForResults('run-data-processing-results', async ({ content, correlationId }) => {
        await experimentService.handleExperimentResults({ content, correlationId })
    })
}

app.listen(process.env.PORT, async () => {
    console.log('Server started on port 8080');
    startListeners();
})