// app/lib/fredService.ts - Federal Reserve Economic Data API Service

interface FREDSeries {
  seriesId: string;
  value: number;
  date: string;
  units: string;
}

interface EconomicIndicators {
  gdpGrowth: number | null;
  inflationRate: number | null;
  unemploymentRate: number | null;
  interestRate: number | null;
  consumerSentiment: number | null;
}

export class FREDService {
  private apiKey: string;
  private baseURL = 'https://api.stlouisfed.org/fred';

  constructor() {
    this.apiKey = process.env.FRED_API_KEY || '';
  }

  // Get key economic indicators
  async getEconomicIndicators(): Promise<EconomicIndicators> {
    try {
      const indicators = await Promise.all([
        this.getSeriesData('GDP'), // Real GDP Growth
        this.getSeriesData('CPIAUCSL'), // Consumer Price Index (Inflation)
        this.getSeriesData('UNRATE'), // Unemployment Rate
        this.getSeriesData('DFF'), // Federal Funds Rate
        this.getSeriesData('UMCSENT') // Consumer Sentiment
      ]);

      return {
        gdpGrowth: indicators[0],
        inflationRate: indicators[1] ? this.calculateYoYChange(indicators[1]) : null,
        unemploymentRate: indicators[2],
        interestRate: indicators[3],
        consumerSentiment: indicators[4]
      };
    } catch (error) {
      console.error('Error fetching FRED indicators:', error);
      return {
        gdpGrowth: null,
        inflationRate: null,
        unemploymentRate: null,
        interestRate: null,
        consumerSentiment: null
      };
    }
  }

  // Get specific series data
  private async getSeriesData(seriesId: string): Promise<number | null> {
    try {
      const params = new URLSearchParams({
        series_id: seriesId,
        api_key: this.apiKey,
        file_type: 'json',
        limit: '1',
        sort_order: 'desc'
      });

      const response = await fetch(`${this.baseURL}/series/observations?${params}`);
      
      if (!response.ok) {
        throw new Error(`FRED API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.observations && data.observations.length > 0) {
        return parseFloat(data.observations[0].value);
      }

      return null;
    } catch (error) {
      console.error(`Error fetching FRED series ${seriesId}:`, error);
      return null;
    }
  }

  // Calculate year-over-year change for inflation
  private calculateYoYChange(currentValue: number): number {
    // Simplified - would need historical data for accurate calculation
    return 3.2; // Placeholder inflation rate
  }

  // Get industry-specific economic context
  async getIndustryEconomicContext(industry: string): Promise<any> {
    const generalIndicators = await this.getEconomicIndicators();
    
    // Industry-specific series mappings
    const industrySeriesMap: { [key: string]: string[] } = {
      'technology': ['NASDAQCOM', 'USSTHPI'], // NASDAQ Composite, Tech sector
      'healthcare': ['SP500_HEALTHCARE', 'HLTHEXP'], // Healthcare indices
      'manufacturing': ['IPMAN', 'ISM_MAN_PMI'], // Manufacturing indices
      'retail': ['RSXFS', 'RETAILSL'], // Retail sales
      'finance': ['DJBA', 'BOGZ1FL'], // Banking indices
    };

    const industrySeries = industrySeriesMap[industry.toLowerCase()] || [];
    const industryData = await Promise.all(
      industrySeries.map(series => this.getSeriesData(series))
    );

    return {
      general: generalIndicators,
      industrySpecific: {
        index1: industryData[0],
        index2: industryData[1],
        trend: this.assessIndustryTrend(industryData)
      },
      economicOutlook: this.generateEconomicOutlook(generalIndicators, industry)
    };
  }

  private assessIndustryTrend(data: (number | null)[]): string {
    const validData = data.filter(d => d !== null);
    if (validData.length === 0) return 'neutral';
    
    // Simplified trend assessment
    const avg = validData.reduce((a, b) => a! + b!, 0) / validData.length;
    return avg > 0 ? 'positive' : 'negative';
  }

  private generateEconomicOutlook(indicators: EconomicIndicators, industry: string): string {
    const outlooks = [];
    
    if (indicators.gdpGrowth && indicators.gdpGrowth > 2) {
      outlooks.push('Strong economic growth supports business expansion');
    }
    
    if (indicators.inflationRate && indicators.inflationRate > 3) {
      outlooks.push('Elevated inflation may impact operating costs');
    }
    
    if (indicators.unemploymentRate && indicators.unemploymentRate < 4) {
      outlooks.push('Tight labor market may increase wage pressures');
    }
    
    if (indicators.interestRate && indicators.interestRate > 4) {
      outlooks.push('Higher interest rates affect borrowing costs');
    }
    
    return outlooks.join('. ') || 'Economic conditions remain stable';
  }
}

// Export helper function
export async function getFREDEconomicData(industry: string) {
  const fredService = new FREDService();
  return await fredService.getIndustryEconomicContext(industry);
}