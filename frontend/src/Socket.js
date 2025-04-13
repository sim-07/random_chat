import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socketIo = io('http://localhost:3001');
        setSocket(socketIo);

        socketIo.on('connect', () => {
            console.log('Socket connected with ID:', socketIo.id);
        });

        return () => {
            socketIo.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}
