import { ExperimentsRow } from "./rows.types.js";

export interface ProcessExperimentRequestBody {
    user_id: string;
    experiment: ExperimentsRow;
}

export interface ProcessExperimentMessage {
    user_id: string;
    experiment_id: string;
    dataset: string;
    task_type: string;
    algorithm: string;
    quantum_method: string;
}

export interface ExperimentConfig {
  dataset: string,
  taskType: string,
  algorithm: string,
  quantumMethod: string
}
