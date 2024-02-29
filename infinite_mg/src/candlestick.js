import React, { useEffect, useState } from 'react';

function CandlestickChart({ id, websocketUrl }) {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        if (websocketUrl && !ws) {
            const socket = new WebSocket(websocketUrl);
            setWs(socket);

            socket.onmessage = (event) => {
                setMessages(prevMessages => [...prevMessages, event.data]);
            };
        }

        return () => {
            if (ws) {
                ws.close();
                setWs(null);
            }
        };
    }, [websocketUrl, ws]);

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
