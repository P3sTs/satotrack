
export interface Insight {
  type: 'bullish' | 'bearish' | 'neutral' | 'warning';
  title: string;
  message: string;
  confidence: number;
  icon: React.ReactNode;
}

export interface InsightGenerationParams {
  price: number;
  change24h: number;
  volume: number;
}
