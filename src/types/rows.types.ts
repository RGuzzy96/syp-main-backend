import { Database } from "./supabase.types.js";

export type ExperimentsRow = Database['public']['Tables']['experiments']['Row'];
export type ExperimentsUpdate = Database['public']['Tables']['experiments']['Update'];