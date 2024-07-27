import React from "react";
import '../assets/styles/Header.css';
import { Link } from 'react-router-dom';
import logoChatRandom from '../assets/images/logo-no-background.png';

const Header = () => {
    return (
        <header>
            <img src={logoChatRandom} alt="logo" />
            <div className="menuContainer">
                <Link to="/">Home</Link>
                <Link to="/About">About</Link>
                <Link to="/Contact">Contact</Link>
            </div>
        </header>
    );
};

export default Header;
