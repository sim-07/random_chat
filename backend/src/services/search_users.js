// backend/services/search_users.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const findAvailableUsers = async (userId) => {
    const { data: pairedData, error: pairedError } = await supabase
        .from('users')
        .select('available')
        .eq('user_id', userId);

    if (pairedError) {
        return res.status(500).json({ error: pairedError.message });
    }

    const isAlreadyPaired = pairedData && pairedData.length > 0 && !pairedData[0].available;

    if (!isAlreadyPaired) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq("available", true)

        if (error) {
            throw new Error(`Errore nel trovare gli utenti: ${error.message}`);
        }

        return data;
    } else {
        return false
    }

};

module.exports = findAvailableUsers;
