const { v4: uuidv4 } = require('uuid');
const supabase = require('../config/supabaseClient');

async function createChatroom(partecipants) {
    const chatId = uuidv4();
    const { data, error } = await supabase
        .from('chatroom')
        .insert([{ chat_id: chatId, partecipants: partecipants }]);

    if (error) {
        throw new Error(error.message);
    }

    console.log("Chatroom creata")
    return chatId;
}

module.exports = createChatroom;
