import React, { useEffect, useState } from 'react';

function CandlestickChart({ id, wsInstance }) {
    console.log('from candle:', wsInstance);
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        if (wsInstance && !ws) {
            const socket = wsInstance;
            setWs(socket);

            socket.onmessage = (event) => {
                console.log('candle event:', event.data);
                setMessages(prevMessages => [...prevMessages, event.data]);
            };
        }

        return () => {
            if (ws) {
                ws.close();
                setWs(null);
            }
        };
    }, [wsInstance, ws]);

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
