
export interface Insight {
  type: 'bullish' | 'bearish' | 'neutral' | 'warning';
  title: string;
  message: string;
  confidence: number;
  iconName: string; // Changed from React.ReactNode to string
}

export interface InsightGenerationParams {
  price: number;
  change24h: number;
  volume: number;
}
