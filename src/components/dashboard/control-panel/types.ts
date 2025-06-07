
export interface AdvancedControlPanelProps {
  onSettingsChange: (settings: any) => void;
}

export interface ControlPanelSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  alertThreshold: number;
  theme: string;
  chartStyle: string;
  notifications: boolean;
  advancedMode: boolean;
}
