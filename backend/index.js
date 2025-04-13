const express = require('express');
const session = require('express-session');
const cors = require('cors');
const chatRoutes = require('./src/routes/chat-routes');
const http = require('http');
const { setupSocket, getIo } = require('./src/socket');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(session({
    secret: '8b081daef841cce1682089b85d4f66ae4ee628cc80dee55c5b74ebfa17689b7468cc61d4b6977d7874da4d239c7629f1a5115cc25c0006e1fdb7b1470dd18407',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware per allegare l'istanza di Socket.io alle richieste
app.use((req, res, next) => {
    req.io = getIo();
    next();
});

app.use('/api', chatRoutes);

const server = http.createServer(app);

const io = setupSocket(server);

const port = 3001;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
