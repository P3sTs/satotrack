
export interface ProjectionDataPoint {
  month: string;
  value: number;
  btc: number;
  conservative: number;
  moderate: number;
  aggressive: number;
}

export interface ScenarioConfig {
  monthly: number;
  volatility: number;
}

export interface ProjectionScenarios {
  conservative: ScenarioConfig;
  moderate: ScenarioConfig;
  aggressive: ScenarioConfig;
}

export type TimeframeType = '3m' | '6m' | '12m';
export type ScenarioType = 'conservative' | 'moderate' | 'aggressive';
