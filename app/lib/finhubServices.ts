// app/lib/finnhubService.ts - Finnhub Financial Data API Service

interface CompanyFinancials {
    symbol: string;
    revenue: number;
    netIncome: number;
    totalAssets: number;
    totalLiabilities: number;
    marketCap: number;
    peRatio: number;
    industry: string;
  }
  
  interface MarketIndicators {
    sp500: number;
    nasdaq: number;
    dow: number;
    vix: number;
    treasuryYield10Y: number;
  }
  
  interface EconomicCalendar {
    date: string;
    event: string;
    impact: 'high' | 'medium' | 'low';
    actual: string;
    estimate: string;
    previous: string;
  }
  
  export class FinnhubService {
    private apiKey: string;
    private baseURL = 'https://finnhub.io/api/v1';
  
    constructor() {
      this.apiKey = process.env.FINNHUB_API_KEY || '';
    }
  
    // Get company financial metrics for benchmarking
    async getCompanyFinancials(symbol: string): Promise<CompanyFinancials | null> {
      try {
        const [basicFinancials, profile, quote] = await Promise.all([
          this.fetchBasicFinancials(symbol),
          this.fetchCompanyProfile(symbol),
          this.fetchQuote(symbol)
        ]);
  
        if (!basicFinancials || !profile || !quote) return null;
  
        return {
          symbol,
          revenue: basicFinancials.metric?.revenuePerShareTTM * basicFinancials.metric?.sharesOutstanding || 0,
          netIncome: basicFinancials.metric?.netIncomePerShareTTM * basicFinancials.metric?.sharesOutstanding || 0,
          totalAssets: basicFinancials.metric?.totalAssetTurnover || 0,
          totalLiabilities: basicFinancials.metric?.totalDebt || 0,
          marketCap: profile.marketCapitalization || 0,
          peRatio: basicFinancials.metric?.peBasicExclExtraTTM || 0,
          industry: profile.finnhubIndustry || 'Unknown'
        };
      } catch (error) {
        console.error('Error fetching company financials:', error);
        return null;
      }
    }
  
    private async fetchBasicFinancials(symbol: string): Promise<any> {
      const response = await fetch(`${this.baseURL}/stock/metric?symbol=${symbol}&metric=all&token=${this.apiKey}`);
      return response.ok ? await response.json() : null;
    }
  
    private async fetchCompanyProfile(symbol: string): Promise<any> {
      const response = await fetch(`${this.baseURL}/stock/profile2?symbol=${symbol}&token=${this.apiKey}`);
      return response.ok ? await response.json() : null;
    }
  
    private async fetchQuote(symbol: string): Promise<any> {
      const response = await fetch(`${this.baseURL}/quote?symbol=${symbol}&token=${this.apiKey}`);
      return response.ok ? await response.json() : null;
    }
  
    // Get market indicators for economic context
    async getMarketIndicators(): Promise<MarketIndicators | null> {
      try {
        const [sp500, nasdaq, dow, vix, treasury] = await Promise.all([
          this.fetchQuote('SPY'),    // S&P 500 ETF
          this.fetchQuote('QQQ'),    // NASDAQ ETF
          this.fetchQuote('DIA'),    // Dow Jones ETF
          this.fetchQuote('VIX'),    // Volatility Index
          this.fetchQuote('TNX')     // 10-Year Treasury Yield
        ]);
  
        return {
          sp500: sp500?.c || 0,
          nasdaq: nasdaq?.c || 0,
          dow: dow?.c || 0,
          vix: vix?.c || 0,
          treasuryYield10Y: treasury?.c || 0
        };
      } catch (error) {
        console.error('Error fetching market indicators:', error);
        return null;
      }
    }
  
    // Get economic calendar events
    async getEconomicCalendar(from: string, to: string): Promise<EconomicCalendar[]> {
      try {
        const response = await fetch(`${this.baseURL}/calendar/economic?from=${from}&to=${to}&token=${this.apiKey}`);
        
        if (!response.ok) return [];
  
        const data = await response.json();
        
        return data.economicCalendar?.map((event: any) => ({
          date: event.time,
          event: event.event,
          impact: this.categorizeImpact(event.impact),
          actual: event.actual || 'N/A',
          estimate: event.estimate || 'N/A',
          previous: event.prev || 'N/A'
        })) || [];
      } catch (error) {
        console.error('Error fetching economic calendar:', error);
        return [];
      }
    }
  
    private categorizeImpact(impact: string): 'high' | 'medium' | 'low' {
      const impactLevel = impact?.toLowerCase() || '';
      if (impactLevel.includes('high') || impactLevel === '3') return 'high';
      if (impactLevel.includes('medium') || impactLevel === '2') return 'medium';
      return 'low';
    }
  
    // Get industry performance data
    async getIndustryPerformance(industry: string): Promise<any> {
      try {
        // Get representative stocks for the industry
        const industrySymbols = this.getIndustrySymbols(industry);
        
        const performanceData = await Promise.all(
          industrySymbols.map(symbol => this.getCompanyFinancials(symbol))
        );
  
        const validData = performanceData.filter(data => data !== null);
        
        if (validData.length === 0) return null;
  
        // Calculate industry averages
        const avgPERatio = validData.reduce((sum, company) => sum + company!.peRatio, 0) / validData.length;
        const avgMarketCap = validData.reduce((sum, company) => sum + company!.marketCap, 0) / validData.length;
        const totalRevenue = validData.reduce((sum, company) => sum + company!.revenue, 0);
  
        return {
          industry,
          averagePERatio: avgPERatio,
          averageMarketCap: avgMarketCap,
          totalIndustryRevenue: totalRevenue,
          sampleSize: validData.length,
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching industry performance:', error);
        return null;
      }
    }
  
    private getIndustrySymbols(industry: string): string[] {
      const industrySymbols: { [key: string]: string[] } = {
        'technology': ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA'],
        'healthcare': ['JNJ', 'PFE', 'UNH', 'ABBV', 'MRK'],
        'finance': ['JPM', 'BAC', 'WFC', 'GS', 'MS'],
        'manufacturing': ['GE', 'MMM', 'CAT', 'HON', 'UTX'],
        'retail': ['WMT', 'AMZN', 'HD', 'TGT', 'COST'],
        'energy': ['XOM', 'CVX', 'COP', 'SLB', 'EOG']
      };
  
      return industrySymbols[industry.toLowerCase()] || industrySymbols['technology'];
    }
  
    // Get real-time market sentiment
    async getMarketSentiment(): Promise<any> {
      try {
        const response = await fetch(`${this.baseURL}/news-sentiment?symbol=SPY&token=${this.apiKey}`);
        
        if (!response.ok) return null;
  
        const data = await response.json();
        
        return {
          sentiment: data.sentiment,
          bullishPercent: data.sentiment * 100,
          bearishPercent: (1 - data.sentiment) * 100,
          newsCount: data.buzz?.articlesInLastWeek || 0,
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching market sentiment:', error);
        return null;
      }
    }
  }
  
  // Combined service for integrated data
  export class IntegratedMarketService {
    private finnhubService: FinnhubService;
  
    constructor() {
      this.finnhubService = new FinnhubService();
    }
  
    async getComprehensiveMarketContext(industry: string): Promise<any> {
      try {
        const [
          marketIndicators,
          industryPerformance,
          marketSentiment
        ] = await Promise.all([
          this.finnhubService.getMarketIndicators(),
          this.finnhubService.getIndustryPerformance(industry),
          this.finnhubService.getMarketSentiment()
        ]);
  
        return {
          industry,
          marketConditions: marketIndicators,
          industryBenchmarks: industryPerformance,
          sentiment: marketSentiment,
          dataQuality: 'comprehensive',
          lastUpdated: new Date().toISOString()
        };
      } catch (error) {
        console.error('Error fetching comprehensive market context:', error);
        return null;
      }
    }
  }
  