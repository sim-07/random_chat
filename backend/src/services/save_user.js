const supabase = require('../config/supabaseClient');

async function saveUser(socketId) {
    const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', socketId);

    if (checkError) {
        throw new Error(checkError.message);
    }

    if (socketId && existingUsers && existingUsers.length === 0) {
        const { data, error } = await supabase
            .from('users')
            .insert([{ user_id: socketId }]);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    console.log(`Utente con socketId ${socketId} esiste già, nessun inserimento effettuato.`);
    return null;
}

module.exports = saveUser;
