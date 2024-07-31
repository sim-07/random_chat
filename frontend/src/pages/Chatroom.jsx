import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/ChatRoom.css';
import '@aws-amplify/ui-react/styles.css';
import { Loader, Message } from '@aws-amplify/ui-react';
import LivingRoom from '../assets/images/livingroom';


function ChatRoom() {
    const [dots, setDots] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const startChat = async () => {
            try {
                const response = await axios.post('http://localhost:3001/api/start-chat');
                console.log(`Chat started with ID: ${response.data.id}`);
                setLoading(false);
                const responseDelete = await axios.post('http://localhost:3001/api/delete-user');
                console.log(responseDelete);
                // sessionStorage.setItem('userId', response.data.id);
            } catch (error) {
                console.error('Error: ', error);
                setError(true);
            }
        };

        startChat();

        const interval = setInterval(() => {
            setDots(prev => (prev.length < 3 ? prev + '.' : ''));
        }, 500);

    }, []);
    


    return (
        <div>
            <div className={`${loading ? '' : 'hide'}`}>
                <LivingRoom />
                <Message className={`${error ? 'errorMessage' : 'hide'}`} colorTheme="error">
                    Nessun utente disponibile! Puoi riprovare tra qualche istante
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
