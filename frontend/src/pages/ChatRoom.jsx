import React, { useState, useEffect } from 'react';
import { Loader, Message } from '@aws-amplify/ui-react';
import { useSocket } from '../Socket';
import '@aws-amplify/ui-react/styles.css';
import axios from 'axios';
import '../assets/styles/ChatRoom.css';
import Header from '../components/Header'

import ChatInput from '../components/ChatInput';
import LivingRoom from '../assets/images/livingroom';
import MessageList from '../components/MessageList';

axios.defaults.withCredentials = true;

function ChatRoom() {
    const [dots, setDots] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputDisabled, setInputDisabled] = useState(false);
    const [chatId, setChatId] = useState(null);
    const socket = useSocket();

    const deleteUser = async () => {
        try {
            const userId = sessionStorage.getItem('userId');
            const chatId = sessionStorage.getItem('chatId');
            console.log("chatId: " + chatId);
            if (userId) {
                await axios.post('http://localhost:3001/api/delete-user', { userId, chatId }, {
                    withCredentials: true
                });
                sessionStorage.clear();
                console.log('User deleted');
            }
        } catch (error) {
            console.error('Error deleting user: ', error);
        }
    };

    const saveUser = async () => {
        try {
            const socketId = socket.id;
            const response = await axios.post('http://localhost:3001/api/save-user', { socketId }, {
                withCredentials: true
            });
            console.log(`User saved with userId: ${response.data.socketId}`);
            sessionStorage.setItem('userId', response.data.socketId);
            return socketId;
        } catch (error) {
            console.error('Error: ', error);
            setErrorMessage(error.response?.data?.error || 'An error occurred while saving the user.');
            setError(true);
            return null;
        }
    };

    const createChatroom = async (userId) => {
        try {
            const response = await axios.post('http://localhost:3001/api/create-chatroom', { userId }, {
                withCredentials: true
            });
            console.log("Entrato in chatId: " + response.data.chatId);
            sessionStorage.setItem('chatId', response.data.chatId);
            setChatId(response.data.chatId);
            setLoading(false);
        } catch (error) {
            console.error('Error: ', error);
            setErrorMessage(error.response?.data?.error || 'An error occurred while finding available users.');
            setError(true);
        }
    };

    const startChatProcess = async () => {
        let userId = sessionStorage.getItem('userId');
        console.log(`Retrieved userId from sessionStorage: ${userId}`);
        if (userId) {
            await deleteUser();
        }

        if (!sessionStorage.getItem('userId')) {
            userId = await saveUser();
            await createChatroom(userId);
        }
    };


    const initChat = () => {

        console.log("Socket in ChatRoom:", socket);
        if (socket) {
            console.log("Socket ID:", socket.id);
        } else {
            deleteUser();
            return;
        }

        setMessages([]);
        setInputDisabled(false)
        setLoading(true)
        setError(false)

        startChatProcess();

        const interval = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + '.' : ''));
        }, 500);

        return () => {
            let chatId = sessionStorage.getItem("chatId");
            clearInterval(interval);
            if (socket) {
                socket.emit('disconnectUser', { chatId });
            }

            deleteUser();
        };
    };

    useEffect(initChat, [socket]);

    //----------------------------Logica messaggi e chat

    useEffect(() => {
        if (socket) {
            socket.on('joinChat', (chatroomId) => {
                console.log('Received chatroom ID from socket:', chatroomId);
                setChatId(chatroomId);
            });

            socket.on('receiveMessage', ({ message, senderId }) => {
                console.log(`Messaggio ricevuto da ${senderId}: ${message}`);
                if (senderId !== sessionStorage.getItem('userId')) {
                    setMessages((prevMessages) => [...prevMessages, { text: message, self: false }]);
                }
            });

            socket.on('disconnectUser', ({ userDisconnect }) => {
                console.log(`Utente disconnesso: ${userDisconnect}`);
                setError(true);
                setErrorMessage("L'utente si è disconnesso");
                setInputDisabled(true);
            });

            if (chatId) {
                socket.emit('joinChat', chatId);
                console.log(`Utente con socket ID: ${socket.id} si è unito alla chatroom con ID: ${chatId}`);
            } else {
                console.log("chatId non disponibile: " + chatId);
            }

            return () => {
                socket.off('joinChat');
                socket.off('receiveMessage');
                socket.off('disconnectUser');
            };
        } else {
            console.error("Socket non è disponibile");
        }
    }, [socket, chatId]);

    const handleSendMessage = (message) => {
        if (socket && chatId && !error) {
            sessionStorage.setItem("userId", socket.id)
            console.log(`Mesaggio inviato: ${message}`);
            socket.emit('sendMessage', { chatId, message, self: true });
            setMessages((prevMessages) => [...prevMessages, { text: message, self: true }]);
        }
    };

    function skipFunction() {
        socket.emit('disconnectUser', { chatId });
        socket.disconnect();
        deleteUser();

        socket.connect();
        initChat();
    }

    return (
        <div>
            <Message className={`${error ? 'errorMessage' : 'hide'}`} colorTheme="error">
                {errorMessage}
            </Message>
            <div className={`${loading ? '' : 'hide'}`}>
                <LivingRoom />
                <div className={`${error ? 'hide' : ''}`}>
                    <div className='loader'>
                        <Loader size="large" style={{ transform: 'scale(8)', position: 'absolute' }} />
                    </div>
                    <h2 className='waitingMessage'>
                        Stiamo cercando qualcuno<br />
                        con cui connetterti. Attendi <span style={{ position: 'absolute' }}>{dots}</span>
                    </h2>
                </div>
            </div>

            <div className={`${loading ? 'hide' : ''}`}>
                <div className='circleSkip' onClick={skipFunction}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        width="24px"
                        viewBox="0 -960 960 960"
                        fill="#e8eaed"
                        transform='scale(1.5)'
                        style={{ marginLeft: '14px' }}
                    >
                        <path
                            d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z" />
                    </svg>
                </div>

                <Header />
                <MessageList messages={messages} />
                <ChatInput onSendMessage={handleSendMessage} disabled={inputDisabled} />
            </div>
        </div>
    );
}

export default ChatRoom;
