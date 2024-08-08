import React from 'react';
import '../assets/styles/MessageList.css';

const MessageList = ({ messages }) => {
    return (
        <div className="messagesContainer">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.self ? 'self' : ''}`}>
                    {message.text}
                </div>
            ))}
        </div>
    );
};

export default MessageList;
