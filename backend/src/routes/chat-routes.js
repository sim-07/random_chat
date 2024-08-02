const express = require('express');
const router = express.Router();
const saveUser = require('../services/save_user');
const findAvailableUsers = require('../services/search_users');
const deleteUser = require('../services/delete_user');
const createChatroom = require('../services/create_chatroom');
const supabase = require('../config/supabaseClient');

router.post('/save-user', async (req, res) => {
    try {
        const userId = await saveUser();
        res.status(200).json({ id: userId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/find-available-users', async (req, res) => {
    
    try {
        let availableUsers = [];
        const userId = req.body.userId;
        const maxAttempts = 30;
        let attempts = 0;

        while (availableUsers.length <= 1 && attempts < maxAttempts) {
            availableUsers = await findAvailableUsers(userId);

            if (availableUsers.length <= 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            }
        }

        if (availableUsers.length > 1) {
            if (userId) {
                const oldestUser = availableUsers
                    .filter(user => user.user_id !== userId)
                    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                    .pop();


                // Controllo se available dell'utente è già stato messo a false dall'altro utente
                if (availableUsers != false) {
                    if (oldestUser) {
                        const { error: updateError } = await supabase
                            .from('users')
                            .update({ available: false })
                            .in('user_id', [userId, oldestUser.user_id]);

                        if (updateError) {
                            return res.status(500).json({ error: updateError.message });
                        }

                        const filteredAvailableUsers = availableUsers.filter(user => user.user_id === userId || user.user_id === oldestUser.user_id);
                        createChatroom(filteredAvailableUsers);

                        return res.status(200).json({ availableUsers: filteredAvailableUsers });
                    }
                } else {
                    console.log("Già messo a false dall'altro utente")
                    // Cerca userId nella tabella chatroom
                    /*const { data: chatroomData, error: chatroomError } = await supabase
                        .from('chatroom')
                        .select('*')
                        .eq('user_id', userId);

                    if (chatroomError) {
                        return res.status(500).json({ error: chatroomError.message });
                    }

                    return res.status(200).json({ chatroom: chatroomData });*/
                }
            }
        }

        if (availableUsers.length <= 1 && attempts >= maxAttempts) {
            return res.status(500).json({ error: 'No available users found' });
        }

        res.status(200).json({ availableUsers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/delete-user', async (req, res) => {
    try {
        const userId = req.body.userId;

        if (userId) {
            await deleteUser(userId);
            res.status(200).json({ message: `User ${userId} removed successfully` });
        } else {
            res.status(400).json({ error: 'User ID is required' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
