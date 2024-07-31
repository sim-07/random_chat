const express = require('express');
const session = require('express-session');
const cors = require('cors');
const chatRoutes = require('./routes/chat');

const app = express();

// Configura cors per permettere richieste dal frontend
app.use(cors());

// Configura express-session
app.use(session({
    secret: '8b081daef841cce1682089b85d4f66ae4ee628cc80dee55c5b74ebfa17689b7468cc61d4b6977d7874da4d239c7629f1a5115cc25c0006e1fdb7b1470dd18407',
    resave: false, // Non salvare la sessione se non è stata modificata
    saveUninitialized: true, // Salva una sessione non inizializzata
    cookie: { secure: false } // Usa `true` solo se utilizzi HTTPS
}));

// Configura middleware per parse JSON
app.use(express.json());

// Usa le route per la chat
app.use('/api', chatRoutes);

// Avvia il server
const port = 3001;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
