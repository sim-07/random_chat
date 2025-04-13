// const { v4: uuidv4 } = require('uuid');
// const supabase = require('../config/supabaseClient');

// async function createChatroom(partecipants) {
//     const chatId = uuidv4();

//     // Aggiorna tutti i partecipanti con il nuovo chatroom_id
//     const { data, error } = await supabase
//         .from('users')
//         .update({ chat_id: chatId })
//         .in('user_id', partecipants);

//     if (error) {
//         throw new Error(`Errore nel creare chat id: ${error.message}`);
//     }

//     return chatId;
// }

// module.exports = createChatroom;
