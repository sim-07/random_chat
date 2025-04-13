import React from 'react';
import '../assets/styles/Footer.css';
import logoChatRandom from '../assets/images/logo-no-background.png';


const MiddleSection = () => {
    return (
        <div className="footer">
            <img src={logoChatRandom} alt="logo" className='footerLogo' />
        </div>
    );
};

export default MiddleSection;
