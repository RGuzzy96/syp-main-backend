import express from "express";
import experimentController from "../controllers/experiment.controller.js";

const ExperimentRouter = express.Router();

ExperimentRouter.post('/run', experimentController.handleExperiment);

export default ExperimentRouter;