const socketIo = require('socket.io');

let io;

function setupSocket(server) {
    io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Unisco il socket alla chatroom identificata da chatId
        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.id} joined chatroom ${chatId}`);
        });

        // Ascolta i messaggi e inoltrali alla stanza appropriata
        socket.on('sendMessage', ({ chatId, message }) => {
            io.to(chatId).emit('receiveMessage', message);
            console.log(`Message sent to chatroom ${chatId}: ${message}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
}

function getIo() {
    if (!io) {
        throw new Error("Socket.io is not initialized!");
    }
    return io;
}

module.exports = { setupSocket, getIo };

