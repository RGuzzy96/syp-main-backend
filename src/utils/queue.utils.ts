import { connectQueue, SendQueueList, RecvQueueList } from "../config/queue.config.js";
import { v4 as uuidV4} from "uuid";
import getSupabaseClient from "../config/supabase.config.js";

type TicketTable = 'run_processing_tickets';

interface TicketOptions {
    user_id: string,
    ticket_table: TicketTable
}

export const publishToQueue = async (queue: SendQueueList, message: any, replyTo: RecvQueueList, ticketOptions?: TicketOptions) => {
    const channel = await connectQueue();
    await channel.assertQueue(queue, { durable: true })

    const correlationId = uuidV4();

    if(ticketOptions && ticketOptions.user_id && ticketOptions.ticket_table){
        const supabase = getSupabaseClient();

        const { error } = await supabase
            .from(ticketOptions.ticket_table)
            .insert([{
                id: correlationId,
                user_id: ticketOptions.user_id,
                status: 'processing'
            }]);

        if(error) throw new Error(`Failed to create processing ticket: ${error.message}`);
    }

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
        persistent: true,
        correlationId,
        replyTo
    });

    return correlationId;
}

export const listenForResults = async (queue: RecvQueueList, onMessage: ({ content, correlationId }) => void) => {
    const channel = await connectQueue();
    await channel.assertQueue(queue, { durable: true });

    channel.consume(queue, (msg) => {
        if(msg){
            const content = JSON.parse(msg.content.toString());
            const correlationId = msg.properties.correlationId;           
            onMessage({ content, correlationId });

            channel.ack(msg);
        }
    });
}