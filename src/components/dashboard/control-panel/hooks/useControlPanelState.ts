
import { useState, useCallback } from 'react';
import { ControlPanelSettings } from '../types';

export const useControlPanelState = (onSettingsChange: (settings: any) => void) => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState([2]);
  const [alertThreshold, setAlertThreshold] = useState([5]);
  const [theme, setTheme] = useState('dark');
  const [chartStyle, setChartStyle] = useState('line');
  const [notifications, setNotifications] = useState(true);
  const [advancedMode, setAdvancedMode] = useState(false);

  const handleSettingChange = useCallback((key: string, value: any) => {
    const newSettings = { [key]: value };
    onSettingsChange(newSettings);
  }, [onSettingsChange]);

  const handleAutoRefreshChange = useCallback((checked: boolean) => {
    setAutoRefresh(checked);
    handleSettingChange('autoRefresh', checked);
  }, [handleSettingChange]);

  const handleRefreshIntervalChange = useCallback((value: number[]) => {
    setRefreshInterval(value);
    handleSettingChange('refreshInterval', value[0]);
  }, [handleSettingChange]);

  const handleAlertThresholdChange = useCallback((value: number[]) => {
    setAlertThreshold(value);
    handleSettingChange('alertThreshold', value[0]);
  }, [handleSettingChange]);

  const handleThemeChange = useCallback((value: string) => {
    setTheme(value);
    handleSettingChange('theme', value);
  }, [handleSettingChange]);

  const handleChartStyleChange = useCallback((value: string) => {
    setChartStyle(value);
    handleSettingChange('chartStyle', value);
  }, [handleSettingChange]);

  const handleNotificationsChange = useCallback((checked: boolean) => {
    setNotifications(checked);
    handleSettingChange('notifications', checked);
  }, [handleSettingChange]);

  const handleAdvancedModeChange = useCallback((checked: boolean) => {
    setAdvancedMode(checked);
    handleSettingChange('advancedMode', checked);
  }, [handleSettingChange]);

  return {
    autoRefresh,
    setAutoRefresh: handleAutoRefreshChange,
    refreshInterval,
    setRefreshInterval: handleRefreshIntervalChange,
    alertThreshold,
    setAlertThreshold: handleAlertThresholdChange,
    theme,
    setTheme: handleThemeChange,
    chartStyle,
    setChartStyle: handleChartStyleChange,
    notifications,
    setNotifications: handleNotificationsChange,
    advancedMode,
    setAdvancedMode: handleAdvancedModeChange,
    handleSettingChange,
  };
};
