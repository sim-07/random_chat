const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabaseClient');

async function saveUser() {
    const userId = uuidv4();
    const { data, error } = await supabase
        .from('users')
        .insert([{ user_id: userId, available: true }]);

    if (error) {
        throw new Error(error.message);
    }

    return userId;
}

module.exports = saveUser;
