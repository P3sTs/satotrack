
import React from 'react';

interface ChartContainerProps {
  chartRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ chartRef, children }) => {
  return (
    <div 
      ref={chartRef} 
      className="w-full h-full p-1 border border-border/30 rounded-md bg-card/50 backdrop-blur-sm shadow-sm relative"
    >
      {children}
    </div>
  );
};

export default ChartContainer;
