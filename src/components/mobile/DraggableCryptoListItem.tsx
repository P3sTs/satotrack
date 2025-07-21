import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import CryptoListItem from './CryptoListItem';

interface DraggableCryptoListItemProps {
  id: string;
  symbol: string;
  name: string;
  network: string;
  price: string;
  change: number;
  amount: string;
  value: string;
  icon: string;
  onClick?: () => void;
  isDragging?: boolean;
}

const DraggableCryptoListItem: React.FC<DraggableCryptoListItemProps> = ({
  id,
  symbol,
  name,
  network,
  price,
  change,
  amount,
  value,
  icon,
  onClick,
  isDragging = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group ${isSortableDragging ? 'z-50' : ''}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing z-10 p-1 rounded bg-dashboard-medium/80 hover:bg-dashboard-medium"
        style={{ touchAction: 'none' }}
      >
        <GripVertical className="h-4 w-4 text-satotrack-text" />
      </div>

      {/* Content with padding to account for drag handle */}
      <div className="pl-8" onClick={onClick}>
        <CryptoListItem
          symbol={symbol}
          name={name}
          network={network}
          price={price}
          change={change}
          amount={amount}
          value={value}
          icon={icon}
        />
      </div>
    </div>
  );
};

export default DraggableCryptoListItem;