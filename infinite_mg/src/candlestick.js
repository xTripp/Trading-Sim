import React, { useEffect, useState } from 'react';

function CandlestickChart({ id, port }) {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        if (port && !ws) {
            const socket = new WebSocket(`ws://localhost:${port}`);
            setWs(socket);
    
            socket.onopen = () => {
                console.log('Frontend WebSocket connection established');
            };
    
            socket.onmessage = (event) => {
                console.log('Received message:', event.data);
                setMessages(prevMessages => [...prevMessages, event.data]);
            };
    
            socket.onclose = () => {
                console.log('Frontend WebSocket connection closed');
            };
    
            socket.onerror = (err) => {
                console.error('Frontend WebSocket error:', err);
            };
        }
    
        return () => {
            if (ws) {
                ws.close();
                setWs(null);
            }
        };
    }, [port, ws]);
    
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
