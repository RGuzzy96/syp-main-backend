import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database, Tables } from '../types/supabase.types.js';

let supabaseClientInstance: SupabaseClient<Database> | null = null;

const getSupabaseClient = (): SupabaseClient<Database> => {
    if(!supabaseClientInstance){

        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

        if(!supabaseUrl || !supabaseServiceKey){
            console.error("Supabase cannot be initialized - missing environment variables");
            throw new Error("Missing Supabase environment variables");
        }

        console.log('Initializing Supabase client...');
        supabaseClientInstance = createClient<Database>(supabaseUrl as string, supabaseServiceKey as string);
    }

    return supabaseClientInstance;
}

export default getSupabaseClient;