import amqp, { Connection, Channel } from 'amqplib';

export type SendQueueList = 
'run-data-processing';

export type RecvQueueList = 
'run-data-processing-results';

let connection: Connection | null = null;
let channel: Channel | null = null;

export const connectQueue = async (): Promise<Channel> => {
    if(!process.env.RABBIT_MQ_HOST || !process.env.RABBIT_MQ_USER || !process.env.RABBIT_MQ_PASSWORD) {
        throw new Error("Error connection to queue - missing environment variables");
    }
    
    if(channel) {
        return channel;
    }

    try {
        connection = await amqp.connect(`amqp://${process.env.RABBIT_MQ_USER}:${process.env.RABBIT_MQ_PASSWORD}@${process.env.RABBIT_MQ_HOST}`);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');
        return channel;
    } catch(error) {
        console.error('Failed to connect to RabbitMQ: ', error);
        throw error;
    }
}

export const closeQueueConnection = async () => {
    try {
        await channel?.close();
        await connection?.close();
        console.log('RabbitMQ connection closed');
    } catch(error) {
        console.error('Failed to close RabbitMQ connection: ', error);
    }
}