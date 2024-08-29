import React, { useEffect, useRef } from 'react';
import '../assets/styles/MessageList.css';

const MessageList = ({ messages }) => {

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="messagesContainer">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.self ? 'self' : ''}`}>
                    {message.text}
                </div>
            ))}
            <div ref={messagesEndRef} /> {/* In scrollToBottom scrollo fino a questo div*/}
        </div>
    );
};

export default MessageList;
