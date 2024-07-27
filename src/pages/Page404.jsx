import React, { useEffect } from 'react';
import '../assets/styles/Page404.css';
import { Link } from 'react-router-dom';

export function Page404() {
    useEffect(() => {
        const handleKeyDown = () => {
            window.location.href = '/';
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className='Container404'>
            <div className="noise"></div>
            <div className="overlay"></div>
            <div className="terminal">
                <h1>Error <span className="errorcode">404</span></h1>
                <p className="output">The page you are looking for might have been removed, had its name changed or is temporarily unavailable.</p>
                <p className="output">Press any key to <Link className='link' to="/">return to the homepage</Link>.</p>
                <p className="output">Good luck.</p>
            </div>
        </div>
    );
}

export default Page404;
