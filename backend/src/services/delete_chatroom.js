const supabase = require('../config/supabaseClient');

async function deleteChatroom(chatId) {
    const { data, error } = await supabase
        .from('chatroom')
        .delete()
        .eq('chat_id', chatId);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

module.exports = deleteChatroom;
