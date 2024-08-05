const express = require('express');
const router = express.Router();
const saveUser = require('../services/save_user');
const findAvailableUsers = require('../services/search_users');
const deleteUser = require('../services/delete_user');
const createChatroom = require('../services/create_chatroom');
const deleteChatroom = require('../services/delete_chatroom');
const supabase = require('../config/supabaseClient');

router.post('/save-user', async (req, res) => {
    try {
        const userId = await saveUser();
        console.log("Salvato utente: " + userId)
        res.status(200).json({ userId: userId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/create-chatroom', async (req, res) => {

    try {
        let availableUsers = [];
        let chatPartecipants = [];
        const userId = req.body.userId;
        const maxAttempts = 30;
        let attempts = 0;
        let chatId = null;

        console.log(userId + " cerca utenti disponibili")

        while (availableUsers.length <= 1 && attempts < maxAttempts) {
            availableUsers = await findAvailableUsers(userId);

            if (availableUsers.length <= 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            } else if (availableUsers && userId) {

                const oldestUser = availableUsers
                    .filter(user => user.user_id !== userId)
                    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                    .pop()?.user_id; //Rimuove e restituisce ultimo elemento, prende user_id facendolo diventare stringa

                console.log("oldestUser trovato da " + userId + ":", oldestUser);

                if (oldestUser) {
                    // Controllo se qualcuno ha già messo paired_with all'utente corrente
                    const { data: checkData, error: checkError } = await supabase
                        .from('users')
                        .select('paired_with')
                        .eq('user_id', userId)
                        .single(); // Dà errore se ci sono più risultati

                    if (checkError) {
                        return res.status(500).json({ error: checkError.message });
                    }

                    const pairedWith = checkData.paired_with;

                    // Nel mentre l'utente oldestUser potrebbe essere stato appaiato, quindi controllo ancora
                    const { data: oldestuserData, error: selectError } = await supabase
                        .from('users')
                        .select('paired_with')
                        .eq('user_id', oldestUser)
                        .single();

                    if (selectError) {
                        return res.status(500).json({ error: selectError.message });
                    }

                    // Se l'utente selezionato è ancora disponibile posso procedere
                    if (oldestuserData.paired_with === null) {
                        //Aggiorno pairedWith di oldestuser o di quello con cui l'utente corrente è già stato appaiato
                        const { error: updateError } = await supabase
                            .from('users')
                            .update({ paired_with: userId })
                            .eq('user_id', pairedWith === null ? oldestUser : pairedWith);

                        if (updateError) {
                            return res.status(500).json({ error: updateError.message });
                        }
                        console.log(userId + " aggiorna pairedWith di " + oldestUser)

                        chatPartecipants.push(userId, oldestUser);

                        console.log("Chatroom creata da " + userId);

                        const result = await createChatroom(chatPartecipants);
                        chatId = result.chatId;
                        const errorChatId = result.error;

                        if (errorChatId) {
                            return res.status(500).json({ error: errorChatId });
                        }

                        console.log("Chat id riga 108: " + chatId);

                    } else {
                        // Se nel mentre l'utente è già stato appaiato continuo la ricerca
                        availableUsers = [];
                        console.log("L'utente selezionato da " + userId + " è già stato appaiato")
                        continue;
                    }

                    return res.status(200).json({ availableUsers: chatPartecipants, chatId: chatId });
                }
            }
        }

        return res.status(500).json({ error: 'No available users found' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/delete-user', async (req, res) => {
    try {
        const { userId, chatId } = req.body;
        console.log("chatId delete: " + chatId)

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (chatId !== undefined && chatId !== null && chatId !== '' && chatId != "undefined") {
            console.log("Errore nel cercare i partecipanti della chatroom 118, chatId: " + chatId)
            //Cerco i partecipanti della chatroom
            const { data: chatroomData, error: chatroomError } = await supabase
                .from('chatroom')
                .select('partecipants')
                .eq('chat_id', chatId)
                .single();

            if (chatroomError) {
                console.log("Errore nel cercare i partecipanti della chatroom 118, chatId: " + chatId)
                return res.status(500).json({ error: chatroomError.message });
            }

            let partecipants = chatroomData.partecipants;
            partecipants = partecipants.filter(id => id !== userId);

            //Controllo se anche l'altro utente ha abbandonato la chat
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('user_id')
                .in('user_id', partecipants);

            if (usersError) {
                console.log("Errore nel controllo se anche l'altro utente ha abbandonato la chat")
                return res.status(500).json({ error: usersError.message });
            }

            if (usersData.length == 0) {
                const { error: deleteChatroomError } = await deleteChatroom(chatId);

                if (deleteChatroomError) {
                    return res.status(500).json({ error: deleteChatroomError.message });
                }
            }
        }


        await deleteUser(userId);

        res.status(200).json({ message: `User ${userId} removed successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;