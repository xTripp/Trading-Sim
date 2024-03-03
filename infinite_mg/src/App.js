import React, { useState } from 'react';
import Navbar from './navbar.js';
import Tile from './tile.js';
import './App.css';
import api from './api';

function App() {
    const [tiles, setTiles] = useState([]);

    const addTile = async () => {
        try {
            const response = await api.get('/add', {
                params: {
                    name: 'basic'
                }
            });
            const port = response.data.port;
            setTiles([...tiles, { id: `tile-${tiles.length}`, port }]);
        } catch (err) {
            console.error("Error adding tile:", err);
        }
    };

    return (
        <div className="app-container">
            <Navbar />
            <div className="main-content">
                <div className="grid-container">
                    {tiles.map((tile) => (
                        <Tile key={tile.id} port={tile.port} />
                    ))}
                    <div className="add-tile" onClick={addTile}>+</div>
                </div>
            </div>
        </div>
    );
}

export default App;
