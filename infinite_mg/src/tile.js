import React, { useEffect, useState } from 'react';
import './tile.css';

function Tile({ id, port }) {
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
        <div className="tile" id={id}>
            <div className='tile-action-bar'>
                Do stuff here
            </div>
            <div className='tile-main-content'>
                <div className='tile-main-panel'>
                    <div className='tile-balance'>
                        <span className='tile-net'>10,100.52</span>
                        <span className='tile-daily'>+100.52 (0.57%)</span>
                    </div>
                    <div className='tile-candles'></div>
                </div>
                <div className='tile-side-panel'>
                    <div className='tile-portfolio'>
                        <table className='tile-portfolio-table'>
                            <thead>
                                <th>Asset</th>
                                <th>#</th>
                                <th>$</th>
                                <th>G/L</th>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>COIN (Coinbase Global, Inc.) Coinbase</td>
                                    <td>20 @ 124.19</td>
                                    <td>$207.00</td>
                                    <td>+1,656.20 (66.68%)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='tile-status'>
                        Thinking...
                    </div>
                </div>
            </div>
            {/* <h2>Candlestick Chart {id}</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul> */}
        </div>
    );
}

export default Tile;