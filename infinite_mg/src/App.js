import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from './navbar.js';
import CandlestickChart from './candlestick.js';
import './App.css';
import api from './api';

function Tile({ id, children }) {
    return (
        <div className="tile" id={id}>
            {children}
        </div>
    );
}

function App() {
    const [tiles, setTiles] = useState([]);

    const addTile = async () => {
        try {
            const response = await api.get('/add', {
                params: {
                    name: 'basic'
                }
            });
            const { websocketUrl } = response.data.ws._url; // Assuming the response contains the websocketUrl
            setTiles([...tiles, { id: `tile-${tiles.length}`, websocketUrl }]);
        } catch (error) {
            console.error("Error adding tile:", error);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <Navbar />
            <div className="App">
                <div className="grid-container">
                    {tiles.map((tile, index) => (
                        <Tile key={tile.id} id={tile.id}>
                            <CandlestickChart id={tile.id} websocketUrl={tile.websocketUrl} />
                        </Tile>
                    ))}
                    <div className="tile" onClick={addTile}>
                        +
                    </div>
                </div>
            </div>
        </DndProvider>
    );
}

export default App;
