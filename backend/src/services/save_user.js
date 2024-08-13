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

    console.log(`Inserimento utente con socketId ${socketId} non effettuato.`);
    return null;
}

module.exports = saveUser;
