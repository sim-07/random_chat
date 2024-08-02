const express = require('express');
const session = require('express-session');
const cors = require('cors');
const chatRoutes = require('./routes/chat-routes');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

// Configura cors per permettere richieste dal frontend
app.use(cors({
    origin: 'http://localhost:3000', // URL del tuo frontend
    credentials: true // Permetti l'invio dei cookie di sessione
}));

// Configura express-session
app.use(session({
    secret: '8b081daef841cce1682089b85d4f66ae4ee628cc80dee55c5b74ebfa17689b7468cc61d4b6977d7874da4d239c7629f1a5115cc25c0006e1fdb7b1470dd18407',
    resave: false, // Non salvare la sessione se non è stata modificata
    saveUninitialized: false, // Non salvare una sessione non inizializzata
    cookie: {
        secure: false, // Usa true solo se utilizzi HTTPS
        httpOnly: true,
        maxAge: 86400000 // 24 ore
    }
}));

// Configura middleware per parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usa le route per la chat
app.use('/api', chatRoutes);

// Crea il server HTTP
const server = http.createServer(app);

// Crea il server Socket.io passando il server HTTP
const io = socketIo(server);

io.on('connection', (socket) => {
    /*console.log('A user connected');

    socket.on('message', (message) => {
        console.log('Received:', message);
        socket.send(message); 
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });*/
});

// Avvia il server
const port = 3001;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
