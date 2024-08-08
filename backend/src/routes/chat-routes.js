const express = require('express');
const router = express.Router();
const saveUser = require('../services/save_user');
const findAvailableUsers = require('../services/search_users');
const deleteUser = require('../services/delete_user');
const supabase = require('../config/supabaseClient');
const { v4: uuidv4 } = require('uuid');

router.post('/save-user', async (req, res) => {
    try {
        const { socketId } = req.body;
        saveUser(socketId);
        console.log("Salvato utente: " + socketId);
        res.status(200).json({ socketId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/create-chatroom', async (req, res) => {
    try {
        let availableUsers = [];
        let chatPartecipants = [];
        const userId = req.body.userId;
        const maxAttempts = 50;
        let attempts = 0;

        console.log(userId + " cerca utenti disponibili");

        while (availableUsers.length <= 1 && attempts < maxAttempts) {
            availableUsers = await findAvailableUsers(userId);

            if (availableUsers.length <= 1) {
                await new Promise(resolve => setTimeout(resolve, 200));
                attempts++;
            } else if (availableUsers && userId) {

                const oldestUser = availableUsers
                    .filter(user => user.user_id !== userId)
                    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                    .pop()?.user_id;

                console.log("oldestUser trovato da " + userId + ":", oldestUser);

                const { userData, errorUserCheck } = await supabase
                    .from('users')
                    .select('paired_with')
                    .eq('user_id', userId)
                    .single();


                if (errorUserCheck) {
                    throw new Error(`Errore nel trovare gli utenti: ${error.message}`);
                }

                if (userData && userData.paired_with !== null) {
                    console.log(userId + "è già stato appaiato");
                    chatPartecipants.push(userId, userData.userId);
                    return res.status(200).json({ availableUsers: chatPartecipants, chatId: chatId });
                }

                if (oldestUser) {

                    const chatId = uuidv4();

                    const { data: functionResult, error: functionError } = await supabase
                        .rpc('match_users'/*'users_match'*/, { user_id1: userId, user_id2: oldestUser, chat_id: chatId });
                    console.log(userId + "chiama la funzione")

                    if (functionError) {
                        if (functionError.message.includes('Conflict in updating user pairing')) {
                            console.log('Conflict detected, retrying...');
                            continue;
                        }
                        return res.status(500).json({ error: functionError.message });
                    }

                    //console.log(functionResult)

                    req.io.to(userId).emit('joinChat', chatId);
                    req.io.to(oldestUser).emit('joinChat', chatId);

                    return res.status(200).json({ availableUsers: chatPartecipants, chatId: chatId });
                }
            }
        }

        return res.status(500).json({ error: 'Nessun utente trovato!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post('/delete-user', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        await deleteUser(userId);

        res.status(200).json({ message: `User ${userId} removed successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;