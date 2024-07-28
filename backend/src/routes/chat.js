const express = require('express');
const router = express.Router();
const saveUser = require('../services/save_user');

// Definisci una route POST per '/start-chat'
router.post('/start-chat', async (req, res) => {
    try {
        const userId = await saveUser();  // Chiama la funzione per salvare l'utente
        res.status(200).json({ id: userId });  // Rispondi con l'ID dell'utente
    } catch (error) {
        res.status(500).json({ error: error.message });  // Gestisci gli errori
    }
});

module.exports = router;
