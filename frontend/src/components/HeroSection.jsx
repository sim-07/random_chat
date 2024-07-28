import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/styles/HeroSection.css';
import ChatImage from '../assets/images/chat_image';

const HeroSection = () => {
    const navigate = useNavigate();

    const startChat = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/start-chat');
            console.log(`Chat started with ID: ${response.data.id}`);
            navigate('/chatroom'); // Reindirizza alla chatroom
        } catch (error) {
            console.error('There was an error starting the chat!', error);
        }
    };

    return (
        <div className="heroSection">
            <div className="slogan">
                <div className='sloganText'>
                    <h1>La chat casuale <br />
                        <span style={{ color: '#98FF98' }}>100% italiana</span><br />
                    </h1>
                    <p className='sottotitoli'>Prova una chat casuale alternativa per fare amicizia, connetterti e chattare con sconosciuti da tutta Italia!</p>
                    <button onClick={startChat}>Inizia la Chat</button>
                </div>

                <ChatImage />
            </div>
        </div>
    );
};

export default HeroSection;
