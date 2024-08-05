const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const findAvailableUsers = async (userId) => {
    try {

        const { data, error } = await supabase
            .from('users')
            .select('user_id')
            .is('paired_with', null);

        if (error) {
            throw new Error(`Errore nel trovare gli utenti: ${error.message}`);
        }

        return data;

    } catch (error) {
        throw new Error(`Errore nel trovare gli utenti: ${error.message}`);
    }
};

module.exports = findAvailableUsers;
