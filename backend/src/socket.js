const socketIo = require('socket.io');

let io;

function setupSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected with ID:', socket.id);

        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
            console.log(`User ${socket.id} joined chatroom ${chatId}`);
        });

        socket.on('sendMessage', ({ chatId, message }) => {
            console.log(`Message received from ${socket.id}: ${message}`);
            io.to(chatId).emit('receiveMessage', {
                message: message,
                senderId: socket.id
            });
            console.log(`Message sent to chatroom ${chatId}: ${message}`);
        });

        socket.on('disconnectUser', ({ chatId }) => {
            console.log('User disconnected with ID:', socket.id);
            io.to(chatId).emit('disconnectUser', {
                userDisconnect: socket.id
            });
            socket.leave(chatId);
            console.log(`${socket.id} si è disconnesso dalla chatroom ${chatId}`)
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
