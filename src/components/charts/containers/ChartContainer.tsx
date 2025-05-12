
import React from 'react';

interface ChartContainerProps {
  children: React.ReactNode;
  chartRef: React.RefObject<HTMLDivElement>;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ children, chartRef }) => {
  return (
    <div 
      ref={chartRef} 
      className="w-full bg-dashboard-medium/10 rounded-lg p-4 min-h-[300px] flex items-center justify-center"
    >
      {children}
    </div>
  );
};

export default ChartContainer;
