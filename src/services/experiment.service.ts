import getSupabaseClient from "../config/supabase.config.js";
import { ProcessExperimentMessage, ProcessExperimentRequestBody } from "../types/experiment.types.js";
import { publishToQueue } from "../utils/queue.utils.js";

async function handleExperiment(body: ProcessExperimentRequestBody) {

    const message: ProcessExperimentMessage = {
        user_id: body.user_id,
        experiment_id: body.experiment.id,
        dataset: body.experiment.dataset,
        task_type: body.experiment.task_type,
        algorithm: body.experiment.classical_algorithm,
        quantum_method: body.experiment.quantum_method
    }

    const experimentProcessingTicket = await publishToQueue('run-data-processing', message, 'run-data-processing-results', { ticket_table: 'run_processing_tickets', user_id: body.user_id});

    return experimentProcessingTicket;
}

async function handleExperimentResults({ content, correlationId }) {
    const supabase = getSupabaseClient();

    console.log('Handling experiment results for correlationId:', correlationId);
    console.log('Content:', content);
}

export default {
    handleExperiment,
    handleExperimentResults
}