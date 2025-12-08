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

    try {
        const supabase = getSupabaseClient();

        if (content.results.quantum){
            const { error: quantumError } = await supabase
                .from('experiment_results')
                .insert({
                    experiment_id: content.experiment_id,
                    user_id: content.user_id,
                    type: 'quantum',
                    accuracy: content.results.quantum.accuracy,
                    training_time: content.results.quantum.training_time,
                    total_time: content.results.quantum.total_time,
                    kernel_time: content.results.quantum.kernel_time,
                    logs: content.results.quantum.logs,
                    created_at: new Date().toISOString(),
                });

            if(quantumError){
                console.error('Error inserting quantum results:', quantumError);
                throw quantumError;
            }  
        }

        if (content.results.classical){
            const { error: classicalError } = await supabase
                .from('experiment_results')
                .insert({
                    experiment_id: content.experiment_id,
                    user_id: content.user_id,
                    type: 'classical',
                    accuracy: content.results.classical.accuracy,
                    training_time: content.results.classical.training_time,
                    total_time: content.results.classical.total_time,
                    kernel_time: content.results.classical.kernel_time,
                    logs: content.results.classical.logs,
                    created_at: new Date().toISOString(),
                });

            if(classicalError){
                console.error('Error inserting classical results:', classicalError);
                throw classicalError;
            }
        }

        const { error } = await supabase
            .from('run_processing_tickets')
            .update({
                status: "completed", 
                last_updated: new Date().toISOString(),
            })
            .eq("id", correlationId);

        if (error) {
            console.error('Error updating ticket status:', error);
            throw error;
        }
    } catch (error) {
        console.error('Error handling experiment results:', error);
    }

    
}

export default {
    handleExperiment,
    handleExperimentResults
}