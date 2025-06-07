
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, Palette, Settings } from 'lucide-react';

interface AdvancedTabProps {
  advancedMode: boolean;
  setAdvancedMode: (value: boolean) => void;
  handleSettingChange: (key: string, value: any) => void;
}

const AdvancedTab: React.FC<AdvancedTabProps> = ({
  advancedMode,
  setAdvancedMode,
  handleSettingChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-satotrack-neon" />
          <span className="text-sm">Modo Avançado</span>
        </div>
        <Switch 
          checked={advancedMode} 
          onCheckedChange={(checked) => {
            setAdvancedMode(checked);
            handleSettingChange('advancedMode', checked);
          }}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <Button variant="outline" size="sm" className="justify-start">
          <TrendingUp className="h-3 w-3 mr-2" />
          Análise Técnica Avançada
        </Button>
        <Button variant="outline" size="sm" className="justify-start">
          <Palette className="h-3 w-3 mr-2" />
          Personalizar Interface
        </Button>
        <Button variant="outline" size="sm" className="justify-start">
          <Settings className="h-3 w-3 mr-2" />
          API Management
        </Button>
      </div>
    </div>
  );
};

export default AdvancedTab;
