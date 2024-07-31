// backend/services/search_users.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const findAvailableUsers = async () => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq("available", true)

    if (error) {
        throw new Error(`Errore nel trovare gli utenti: ${error.message}`);
    }

    return data;
};

module.exports = findAvailableUsers;
