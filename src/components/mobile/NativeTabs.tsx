import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface NativeTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

const NativeTabs: React.FC<NativeTabsProps> = ({ tabs, defaultTab, onTabChange }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="flex items-center px-6 py-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`relative px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === tab.id
              ? 'text-white'
              : 'text-satotrack-text hover:text-white'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-satotrack-neon rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
};

export default NativeTabs;