import React from 'react';
import { useDrag } from 'react-dnd';

const CandlestickChart = ({ id }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'chart',
    item: { id },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="chart"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Render your candlestick chart here */}
      <p>Chart {id}</p>
    </div>
  );
};

export default CandlestickChart;
