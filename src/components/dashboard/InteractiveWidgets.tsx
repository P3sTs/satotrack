
import React from 'react';
import { useGamification } from '@/contexts/gamification/GamificationContext';
import WidgetExpansionModal from './WidgetExpansionModal';
import WidgetCard from './widgets/components/WidgetCard';
import { useWidgetState } from './widgets/hooks/useWidgetState';
import { useWidgetActions } from './widgets/hooks/useWidgetActions';

const InteractiveWidgets: React.FC = () => {
  const { userStats } = useGamification();
  const {
    widgets,
    setWidgets,
    expandedWidget,
    setExpandedWidget,
    savedWidgets,
    setSavedWidgets
  } = useWidgetState();

  const {
    toggleMinimize,
    toggleFavorite,
    handleLike,
    handleExpand,
    handleSave,
    handleShare,
    handleExport
  } = useWidgetActions(
    widgets,
    setWidgets,
    savedWidgets,
    setSavedWidgets,
    setExpandedWidget
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map(widget => (
          <WidgetCard
            key={widget.id}
            widget={widget}
            savedWidgets={savedWidgets}
            onToggleMinimize={toggleMinimize}
            onToggleFavorite={toggleFavorite}
            onLike={handleLike}
            onExpand={handleExpand}
            onExport={handleExport}
            onShare={handleShare}
            onSave={handleSave}
          />
        ))}
      </div>
      
      <WidgetExpansionModal
        widget={expandedWidget}
        isOpen={!!expandedWidget}
        onClose={() => setExpandedWidget(null)}
        likesCount={expandedWidget ? (userStats.widgetLikes[expandedWidget.id] || 0) : 0}
      />
    </>
  );
};

export default InteractiveWidgets;
