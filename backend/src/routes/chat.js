const express = require('express');
const router = express.Router();
const saveUser = require('../services/save_user');
const findAvailableUsers = require('../services/search_users');
const deleteUser = require('../services/delete_user');
const supabase = require('../config/supabaseClient');

router.post('/start-chat', async (req, res) => {
    try {
        let availableUsers = [];
        let userId = null;
        const maxAttempts = 20;
        let attempts = 0;

        if (!req.session.userId) {
            userId = await saveUser();
            req.session.userId = userId;
        } else {
            userId = req.session.userId;
        }

        while (availableUsers.length <= 1 && attempts < maxAttempts) {
            availableUsers = await findAvailableUsers();

            if (availableUsers.length <= 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            }
        }

        if (availableUsers.length <= 1 && attempts >= maxAttempts) {
            await deleteUser(userId);
            req.session.destroy();
            return res.status(404).json({ error: 'No available users found' });
        }

        res.status(200).json({ id: userId, availableUsers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/delete-user', async (req, res) => {
    try {
        const userId = req.session.userId;

        if (userId) {
            await deleteUser(userId);
            req.session.destroy();
        }

        res.status(200).json({ message: 'User ' + userId +' removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
