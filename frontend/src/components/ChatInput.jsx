import React, { useState } from 'react';
import '../assets/styles/ChatInput.css';

const ChatInput = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
            document.getElementById("inputMessage").focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className='chatInputContainer'>
            <div className='sendMessageContainer'>
                <input
                    id='inputMessage'
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    placeholder="Scrivi qui..."
                />
                <div className='circleInput'></div>
                <div className='sendMessageIcon' onClick={handleSend}></div>
            </div>
        </div>
    );
};

export default ChatInput;
