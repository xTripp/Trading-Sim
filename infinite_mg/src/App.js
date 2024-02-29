import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from './navbar.js';
import CandlestickChart from './candlestick.js';
import './App.css';

function Tile({ id, children }) {
    return (
        <div className="tile" id={id}>
            {children}
        </div>
    );
}

function App() {
    const [tiles, setTiles] = useState([]);

    const addTile = () => {
        setTiles([...tiles, { id: `tile-${tiles.length}` }]);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="App">
                <div className="grid-container">
                    {tiles.map((tile, index) => (
                        <Tile key={tile.id} id={tile.id}>
                            <CandlestickChart id={tile.id} />
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
