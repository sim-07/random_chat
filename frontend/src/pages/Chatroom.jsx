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
                console.log(`User saved with userId: ${response.data.id}`);
                sessionStorage.setItem('userId', response.data.id);
                return response.data.id;
            } catch (error) {
                console.error('Error: ', error);
                setErrorMessage(error.response?.data?.error || 'An error occurred while saving the user.');
                setError(true);
                return null;
            }
        };

        const findAvailableUsers = async (userId) => {
            try {
                const response = await axios.post('http://localhost:3001/api/find-available-users', { userId }, {
                    withCredentials: true
                });
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
            if (!userId) {
                userId = await saveUser();
            }
            if (userId) {
                await findAvailableUsers(userId);
            }
        };

        startChatProcess();

        const deleteUser = async () => {
            try {
                const userId = sessionStorage.getItem('userId');
                if (userId) {
                    await axios.post('http://localhost:3001/api/delete-user', { userId }, {
                        withCredentials: true
                    });
                    console.log('User deleted');
                    sessionStorage.removeItem('userId');
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
