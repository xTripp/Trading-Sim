import React, { useEffect, useState } from 'react';

function CandlestickChart({ id, port }) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        let ws;

        if (port) {
            ws = new WebSocket(`ws://localhost:${port}`);
    
            ws.onopen = () => {
                console.log('Frontend WebSocket connection established');
            };
    
            ws.onmessage = (event) => {
                handleReceivedMessage(event.data);
            };
    
            ws.onclose = () => {
                console.log('Frontend WebSocket connection closed');
            };
    
            ws.onerror = (err) => {
                console.error('Frontend WebSocket error:', err);
            };
    
            // Cleanup function
            return () => {
                if (ws) {
                    ws.close();
                }
            };
        }
    }, [port]);

    const handleReceivedMessage = (data) => {
        if (typeof data === 'string') {
            // Handle string data directly
            setMessages(prevMessages => [...prevMessages, data]);
        } else if (data instanceof Blob) {
            // Handle Blob data using FileReader
            const reader = new FileReader();
            reader.onload = () => {
                const messageString = reader.result;
                setMessages(prevMessages => [...prevMessages, messageString]);
            };
            reader.readAsText(data);
        } else {
            console.error('Unsupported data type received:', data);
        }
    };
    
    return (
        <div>
            <h2>Candlestick Chart {id}</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </div>
    );
}

export default CandlestickChart;
