import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/HeroSection.css';
import ChatImage from '../assets/images/chat_image';

const HeroSection = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/chatroom');
    };

    return (
        <div className="heroSection">
            <div className="slogan">
                <div className='sloganText'>
                    <h1>La chat casuale <br />
                        <span style={{ color: '#98FF98' }}>100% italiana</span><br />
                    </h1>
                    <p className='sottotitoli'>Prova una chat casuale alternativa per fare amicizia, connetterti e chattare con sconosciuti da tutta Italia!</p>
                    <button onClick={handleClick}>Inizia la Chat</button>
                </div>

                <ChatImage />
            </div>
        </div>
    );
};

export default HeroSection;
