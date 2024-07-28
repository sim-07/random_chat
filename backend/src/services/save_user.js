const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabaseClient');

async function saveUser() {
    const userId = uuidv4();
    const { data, error } = await supabase
        .from('users')
        .insert([{ id: userId }]);

    if (error) {
        throw new Error(error.message);
    }
    return userId;
}

module.exports = saveUser;
