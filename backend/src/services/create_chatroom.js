const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabaseClient');

async function createChatroom(partecipants) {
    const chatId = uuidv4();
    const { data, error } = await supabase
        .from('chatroom')
        .insert([{ chat_id: chatId, partecipants }]);

    if (error) {
        console.error("Error creating chatroom:", error.message);
        throw new Error(error.message);
    }

    return chatId;
}

module.exports = createChatroom;
