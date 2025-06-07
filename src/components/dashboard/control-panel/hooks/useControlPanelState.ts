
import { useState } from 'react';
import { ControlPanelSettings } from '../types';

export const useControlPanelState = (onSettingsChange: (settings: any) => void) => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState([2]);
  const [alertThreshold, setAlertThreshold] = useState([5]);
  const [theme, setTheme] = useState('dark');
  const [chartStyle, setChartStyle] = useState('line');
  const [notifications, setNotifications] = useState(true);
  const [advancedMode, setAdvancedMode] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { [key]: value };
    onSettingsChange(newSettings);
  };

  return {
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
    alertThreshold,
    setAlertThreshold,
    theme,
    setTheme,
    chartStyle,
    setChartStyle,
    notifications,
    setNotifications,
    advancedMode,
    setAdvancedMode,
    handleSettingChange,
  };
};
