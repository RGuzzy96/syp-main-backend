import { Request, Response, NextFunction } from "express";
import experimentService from "../services/experiment.service.js";

async function handleExperiment(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await experimentService.handleExperiment(req.body));
    } catch(error) {
        console.error("Error while processing experiment: ", error.message);
        next(error);
    }
};

export default {
    handleExperiment
};