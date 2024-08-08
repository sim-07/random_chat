const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabaseClient');

async function saveUser(socketId) {
    
    const { data, error } = await supabase
        .from('users')
        .insert([{ user_id: socketId }]);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

module.exports = saveUser;
