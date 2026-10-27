import { createClient } from '@supabase/supabase-js';

const urlSupabase = 'https://seacduobnuaybywwohbt.supabase.co';
const claveAnonSupabase = 'sb_publishable_KdbRfgR2rbuCnuGudxjb5w_cSlBs0Js';

export const clienteSupabase = createClient(urlSupabase, claveAnonSupabase);