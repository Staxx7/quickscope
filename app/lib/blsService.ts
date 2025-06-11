// app/lib/blsService.ts - Bureau of Labor Statistics API Service

interface BLSSeriesData {
    seriesID: string;
    data: Array<{
      year: string;
      period: string;
      periodName: string;
      value: string;
      footnotes: any[];
    }>;
  }
  
  interface BLSResponse {
    status: string;
    responseTime: number;
    message: string[];
    Results: {
      series: BLSSeriesData[];
    };
  }
  
  interface IndustryMetrics {
    industry: string;
    averageWage: number;
    employmentLevel: number;
    productivityIndex: number;
    period: string;
  }
  
  export class BLSService {
    private apiKey: string;
    private baseURL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';
  
    constructor() {
      this.apiKey = process.env.BLS_API_KEY || '';
    }
  
    // Industry-specific BLS series IDs for comprehensive data
    private getIndustrySeriesIds(industryCode: string): string[] {
      const seriesMap: { [key: string]: string[] } = {
        // Technology/Information (NAICS 51)
        'technology': [
          'CES5151000001', // Information - Average Hourly Earnings
          'CES5151000008', // Information - Average Weekly Hours  
          'CES5151000001', // Information - All Employees
          'PRS51000092',   // Information - Productivity Index
        ],
        
        // Healthcare (NAICS 62)
        'healthcare': [
          'CES6562000003', // Healthcare - Average Hourly Earnings
          'CES6562000008', // Healthcare - Average Weekly Hours
          'CES6562000001', // Healthcare - All Employees
          'PRS62000092',   // Healthcare - Productivity Index
        ],
        
        // Manufacturing (NAICS 31-33)
        'manufacturing': [
          'CES3000000003', // Manufacturing - Average Hourly Earnings
          'CES3000000008', // Manufacturing - Average Weekly Hours
          'CES3000000001', // Manufacturing - All Employees
          'PRS30000092',   // Manufacturing - Productivity Index
        ],
        
        // Professional Services (NAICS 54)
        'professional-services': [
          'CES6054000003', // Professional Services - Average Hourly Earnings
          'CES6054000008', // Professional Services - Average Weekly Hours
          'CES6054000001', // Professional Services - All Employees
          'PRS54000092',   // Professional Services - Productivity Index
        ],
        
        // Finance and Insurance (NAICS 52)
        'finance': [
          'CES5552000003', // Finance - Average Hourly Earnings
          'CES5552000008', // Finance - Average Weekly Hours
          'CES5552000001', // Finance - All Employees
          'PRS52000092',   // Finance - Productivity Index
        ],
        
        // Retail Trade (NAICS 44-45)
        'retail': [
          'CES4200000003', // Retail - Average Hourly Earnings
          'CES4200000008', // Retail - Average Weekly Hours
          'CES4200000001', // Retail - All Employees
          'PRS42000092',   // Retail - Productivity Index
        ]
      };
  
      return seriesMap[industryCode.toLowerCase()] || seriesMap['technology'];
    }
  
    async getIndustryBenchmarks(industry: string): Promise<IndustryMetrics | null> {
      try {
        const seriesIds = this.getIndustrySeriesIds(industry);
        const currentYear = new Date().getFullYear();
        const startYear = currentYear - 2; // Get 3 years of data
  
        const requestBody = {
          seriesid: seriesIds,
          startyear: startYear.toString(),
          endyear: currentYear.toString(),
          registrationkey: this.apiKey
        };
  
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
  
        if (!response.ok) {
          throw new Error(`BLS API error: ${response.status}`);
        }
  
        const data: BLSResponse = await response.json();
        
        if (data.status !== 'REQUEST_SUCCEEDED') {
          console.error('BLS API request failed:', data.message);
          return null;
        }
  
        return this.parseIndustryMetrics(data.Results.series, industry);
      } catch (error) {
        console.error('Error fetching BLS industry data:', error);
        return null;
      }
    }
  
    private parseIndustryMetrics(series: BLSSeriesData[], industry: string): IndustryMetrics {
      const metrics: IndustryMetrics = {
        industry,
        averageWage: 0,
        employmentLevel: 0,
        productivityIndex: 100,
        period: ''
      };
  
      for (const serie of series) {
        const latestData = serie.data[0]; // Most recent data point
        const value = parseFloat(latestData.value);
  
        // Parse based on series ID patterns
        if (serie.seriesID.includes('000003')) {
          // Average Hourly Earnings
          metrics.averageWage = value;
        } else if (serie.seriesID.includes('000001')) {
          // All Employees (in thousands)
          metrics.employmentLevel = value * 1000; // Convert to actual count
        } else if (serie.seriesID.includes('092')) {
          // Productivity Index
          metrics.productivityIndex = value;
        }
  
        if (!metrics.period) {
          metrics.period = `${latestData.year}-${latestData.period}`;
        }
      }
  
      return metrics;
    }
  
    // Get unemployment rate by industry
    async getIndustryUnemploymentRate(industry: string): Promise<number | null> {
      try {
        // Use general unemployment rate series as baseline
        const seriesId = 'LNS14000000'; // Civilian Unemployment Rate
        
        const requestBody = {
          seriesid: [seriesId],
          startyear: new Date().getFullYear().toString(),
          endyear: new Date().getFullYear().toString(),
          registrationkey: this.apiKey
        };
  
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
  
        const data: BLSResponse = await response.json();
        
        if (data.status === 'REQUEST_SUCCEEDED' && data.Results.series.length > 0) {
          const latestData = data.Results.series[0].data[0];
          return parseFloat(latestData.value);
        }
  
        return null;
      } catch (error) {
        console.error('Error fetching unemployment data:', error);
        return null;
      }
    }
  
    // Get Consumer Price Index for inflation context
    async getInflationData(): Promise<number | null> {
      try {
        const seriesId = 'CUUR0000SA0'; // Consumer Price Index - All Urban Consumers
        
        const requestBody = {
          seriesid: [seriesId],
          startyear: (new Date().getFullYear() - 1).toString(),
          endyear: new Date().getFullYear().toString(),
          registrationkey: this.apiKey
        };
  
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
  
        const data: BLSResponse = await response.json();
        
        if (data.status === 'REQUEST_SUCCEEDED' && data.Results.series.length > 0) {
          const series = data.Results.series[0];
          if (series.data.length >= 12) {
            // Calculate year-over-year inflation
            const current = parseFloat(series.data[0].value);
            const yearAgo = parseFloat(series.data[11].value);
            return ((current - yearAgo) / yearAgo) * 100;
          }
        }
  
        return null;
      } catch (error) {
        console.error('Error fetching inflation data:', error);
        return null;
      }
    }
  
    // Get comprehensive industry benchmark report
    async getComprehensiveIndustryReport(industry: string): Promise<any> {
      try {
        const [industryMetrics, unemploymentRate, inflationRate] = await Promise.all([
          this.getIndustryBenchmarks(industry),
          this.getIndustryUnemploymentRate(industry),
          this.getInflationData()
        ]);
  
        return {
          industry,
          metrics: industryMetrics,
          economicContext: {
            unemploymentRate,
            inflationRate,
            dataSource: 'U.S. Bureau of Labor Statistics',
            lastUpdated: new Date().toISOString()
          },
          benchmarks: this.calculateIndustryBenchmarks(industryMetrics, industry)
        };
      } catch (error) {
        console.error('Error generating comprehensive industry report:', error);
        return null;
      }
    }
  
    private calculateIndustryBenchmarks(metrics: IndustryMetrics | null, industry: string): any {
      if (!metrics) return null;
  
      // Industry-specific benchmark calculations
      const benchmarks = {
        wageCompetitiveness: this.calculateWageCompetitiveness(metrics.averageWage, industry),
        employmentTrend: this.analyzeEmploymentTrend(metrics.employmentLevel),
        productivityRating: this.assessProductivity(metrics.productivityIndex),
        industryHealthScore: 0
      };
  
      // Calculate overall industry health score
      benchmarks.industryHealthScore = Math.round(
        (benchmarks.wageCompetitiveness + 
         benchmarks.employmentTrend + 
         benchmarks.productivityRating) / 3
      );
  
      return benchmarks;
    }
  
    private calculateWageCompetitiveness(wage: number, industry: string): number {
      // Industry-specific wage benchmarks (approximate national averages)
      const industryWageBenchmarks: { [key: string]: number } = {
        'technology': 45.00,
        'healthcare': 35.00,
        'manufacturing': 28.00,
        'finance': 42.00,
        'professional-services': 38.00,
        'retail': 18.00
      };
  
      const benchmark = industryWageBenchmarks[industry.toLowerCase()] || 30.00;
      const competitiveness = (wage / benchmark) * 100;
      
      return Math.min(100, Math.max(0, competitiveness));
    }
  
    private analyzeEmploymentTrend(employmentLevel: number): number {
      // Simplified employment trend analysis
      // In real implementation, compare with historical data
      if (employmentLevel > 1000000) return 85; // Large industry
      if (employmentLevel > 500000) return 75;  // Medium industry
      if (employmentLevel > 100000) return 65;  // Smaller industry
      return 55; // Very small or niche industry
    }
  
    private assessProductivity(productivityIndex: number): number {
      // Productivity assessment based on index value
      if (productivityIndex > 110) return 90;  // High productivity
      if (productivityIndex > 105) return 80;  // Above average
      if (productivityIndex > 95) return 70;   // Average
      if (productivityIndex > 90) return 60;   // Below average
      return 50; // Low productivity
    }
  }
  
  // Usage example for integration:
  export async function getIndustryContext(industry: string) {
    const blsService = new BLSService();
    const report = await blsService.getComprehensiveIndustryReport(industry);
    
    return {
      industryMetrics: report?.metrics,
      economicContext: report?.economicContext,
      benchmarkScores: report?.benchmarks,
      dataQuality: report ? 'high' : 'fallback'
    };
  }