const supabase = require('../config/supabaseClient');

async function deleteUser(userId) {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('user_id', userId);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

module.exports = deleteUser;
