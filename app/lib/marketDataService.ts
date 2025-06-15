// app/lib/marketDataService.ts - Stock Market and Financial Data Service

interface MarketData {
  industryIndex: number | null;
  marketSentiment: string;
  sectorPerformance: number | null;
  volatility: string | null;
  trendingCompanies: string[];
  economicEvents?: Array<{
    date: string;
    event: string;
    impact: string;
  }>;
}

interface CompanyFinancials {
  marketCap: number | null;
  peRatio: number | null;
  revenue: number | null;
  profitMargin: number | null;
}

export class AlphaVantageService {
  private apiKey: string;
  private baseURL = 'https://www.alphavantage.co/query';

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || '';
  }

  async getIndustrySectorPerformance(sector: string): Promise<number | null> {
    try {
      const params = new URLSearchParams({
        function: 'SECTOR',
        apikey: this.apiKey
      });

      const response = await fetch(`${this.baseURL}?${params}`);
      const data = await response.json();

      // Map industry to sector
      const sectorMap: { [key: string]: string } = {
        'technology': 'Information Technology',
        'healthcare': 'Health Care',
        'finance': 'Financials',
        'retail': 'Consumer Discretionary',
        'manufacturing': 'Industrials'
      };

      const mappedSector = sectorMap[sector.toLowerCase()] || 'Information Technology';
      
      if (data['Rank A: Real-Time Performance']) {
        return parseFloat(data['Rank A: Real-Time Performance'][mappedSector] || '0');
      }

      return null;
    } catch (error) {
      console.error('Error fetching Alpha Vantage sector data:', error);
      return null;
    }
  }

  async getMarketOverview(): Promise<any> {
    try {
      const params = new URLSearchParams({
        function: 'MARKET_STATUS',
        apikey: this.apiKey
      });

      const response = await fetch(`${this.baseURL}?${params}`);
      const data = await response.json();

      return {
        marketStatus: data.markets?.[0]?.current_status || 'unknown',
        lastUpdate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching market overview:', error);
      return null;
    }
  }
}

export class FinnhubService {
  private apiKey: string;
  private baseURL = 'https://finnhub.io/api/v1';

  constructor() {
    this.apiKey = process.env.FINNHUB_API_KEY || '';
  }

  async getMarketSentiment(industry: string): Promise<string> {
    try {
      // Get news sentiment for the industry
      const response = await fetch(
        `${this.baseURL}/news?category=general&token=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }

      const news = await response.json();
      
      // Analyze sentiment from news headlines (simplified)
      let positiveCount = 0;
      let negativeCount = 0;
      
      news.slice(0, 20).forEach((article: any) => {
        const headline = (article.headline || '').toLowerCase();
        if (headline.includes('growth') || headline.includes('surge') || headline.includes('gain')) {
          positiveCount++;
        }
        if (headline.includes('decline') || headline.includes('fall') || headline.includes('loss')) {
          negativeCount++;
        }
      });

      if (positiveCount > negativeCount + 2) return 'bullish';
      if (negativeCount > positiveCount + 2) return 'bearish';
      return 'neutral';
    } catch (error) {
      console.error('Error fetching Finnhub sentiment:', error);
      return 'neutral';
    }
  }

  async getEconomicCalendar(): Promise<any[]> {
    try {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const params = new URLSearchParams({
        from: today.toISOString().split('T')[0],
        to: nextWeek.toISOString().split('T')[0],
        token: this.apiKey
      });

      const response = await fetch(`${this.baseURL}/calendar/economic?${params}`);
      
      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.economicCalendar?.slice(0, 5) || [];
    } catch (error) {
      console.error('Error fetching economic calendar:', error);
      return [];
    }
  }

  async getIndustryMetrics(symbol: string = 'AAPL'): Promise<CompanyFinancials> {
    try {
      const params = new URLSearchParams({
        symbol: symbol,
        metric: 'all',
        token: this.apiKey
      });

      const response = await fetch(`${this.baseURL}/stock/metric?${params}`);
      
      if (!response.ok) {
        throw new Error(`Finnhub API error: ${response.status}`);
      }

      const data = await response.json();
      const metrics = data.metric || {};

      return {
        marketCap: metrics.marketCapitalization || null,
        peRatio: metrics.peExclExtraTTM || null,
        revenue: metrics.revenuePerShareTTM || null,
        profitMargin: metrics.netProfitMarginTTM || null
      };
    } catch (error) {
      console.error('Error fetching company metrics:', error);
      return {
        marketCap: null,
        peRatio: null,
        revenue: null,
        profitMargin: null
      };
    }
  }
}

// Combined market data service
export class MarketDataService {
  private alphaVantage: AlphaVantageService;
  private finnhub: FinnhubService;

  constructor() {
    this.alphaVantage = new AlphaVantageService();
    this.finnhub = new FinnhubService();
  }

  async getComprehensiveMarketData(industry: string): Promise<MarketData> {
    const [
      sectorPerformance,
      marketSentiment,
      economicEvents
    ] = await Promise.all([
      this.alphaVantage.getIndustrySectorPerformance(industry),
      this.finnhub.getMarketSentiment(industry),
      this.finnhub.getEconomicCalendar()
    ]);

    return {
      industryIndex: sectorPerformance,
      marketSentiment,
      sectorPerformance,
      volatility: this.calculateVolatility(sectorPerformance),
      trendingCompanies: this.getIndustryLeaders(industry),
      economicEvents: economicEvents.map(event => ({
        date: event.time,
        event: event.event,
        impact: event.impact
      }))
    };
  }

  private calculateVolatility(performance: number | null): string | null {
    if (!performance) return null;
    // Simplified volatility calculation
    return Math.abs(performance) > 2 ? 'high' : Math.abs(performance) > 1 ? 'medium' : 'low';
  }

  private getIndustryLeaders(industry: string): string[] {
    const leaders: { [key: string]: string[] } = {
      'technology': ['Apple', 'Microsoft', 'Google', 'Amazon'],
      'healthcare': ['UnitedHealth', 'Johnson & Johnson', 'Pfizer'],
      'finance': ['JPMorgan Chase', 'Bank of America', 'Wells Fargo'],
      'retail': ['Amazon', 'Walmart', 'Home Depot'],
      'manufacturing': ['3M', 'Boeing', 'Caterpillar']
    };

    return leaders[industry.toLowerCase()] || ['Industry Leaders'];
  }
}

// Export helper function
export async function getMarketIntelligence(industry: string) {
  const marketService = new MarketDataService();
  return await marketService.getComprehensiveMarketData(industry);
}