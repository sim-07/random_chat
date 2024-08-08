const express = require('express');
const session = require('express-session');
const cors = require('cors');
const chatRoutes = require('./routes/chat-routes');
const http = require('http');
const { setupSocket, getIo } = require('./socket');

const app = express();

// Cors per permettere richieste dal frontend
app.use(cors({
    origin: 'http://localhost:3000', // Usa l'URL del frontend durante lo sviluppo
    credentials: true // Permetti l'invio dei cookie di sessione
}));

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


app.use((req, res, next) => {
    req.io = getIo();
    next();
});

app.use('/api', chatRoutes);

// Crea il server HTTP
const server = http.createServer(app);

// Configura Socket.io con CORS
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

setupSocket(io);

// Avvia il server
const port = 3001;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
