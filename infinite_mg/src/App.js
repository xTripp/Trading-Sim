import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Navbar from './navbar.js';
import CandlestickChart from './candlestick.js';
import './App.css';

function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <Navbar></Navbar>
            <div className="App">
                <div className="chart-container">
                    <CandlestickChart id="chart1" />
                </div>
                <div className="chart-container">
                    <CandlestickChart id="chart2" />
                </div>
            </div>
        </DndProvider>
    );
}

export default App;
