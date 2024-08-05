import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/ChatRoom.css';
import '@aws-amplify/ui-react/styles.css';
import { Loader, Message } from '@aws-amplify/ui-react';
import LivingRoom from '../assets/images/livingroom';

axios.defaults.withCredentials = true;

function ChatRoom() {
    const [dots, setDots] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

        const saveUser = async () => {
            try {
                const response = await axios.post('http://localhost:3001/api/save-user', {}, {
                    withCredentials: true
                });
                console.log(`User saved with userId: ${response.data.userId}`);
                sessionStorage.setItem('userId', response.data.userId);
                return response.data.userId;
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
                setLoading(false);
            } catch (error) {
                console.error('Error: ', error);
                setErrorMessage(error.response?.data?.error || 'An error occurred while finding available users.');
                setError(true);
            }
        };

        // Chiamo le funzioni
        const startChatProcess = async () => {
            let userId = sessionStorage.getItem('userId');
            console.log(`Retrieved userId from sessionStorage: ${userId}`);
            if (!userId) {
                userId = await saveUser();
            }
            if (userId) {
                console.log("createChatroom")
                await createChatroom(userId);
            }
        };

        startChatProcess();

        const deleteUser = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                const chatId = sessionStorage.getItem('chatId');
                console.log("chatId: " + chatId)
                if (userId) {
                    await axios.post('http://localhost:3001/api/delete-user', { userId, chatId }, {
                        withCredentials: true
                    });
                    sessionStorage.clear()
                    console.log('User deleted');
                }
            } catch (error) {
                console.error('Error deleting user: ', error);
            }
        };

        const interval = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + '.' : ''));
        }, 500);

        return () => {
            clearInterval(interval);
            deleteUser(); // Quando il componente viene smontato elimino l'utente
        };
    }, []);

    return (
        <div>
            <div className={`${loading ? '' : 'hide'}`}>
                <LivingRoom />
                <Message className={`${error ? 'errorMessage' : 'hide'}`} colorTheme="error">
                    {errorMessage}
                </Message>
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
        </div>
    );
}

export default ChatRoom;
