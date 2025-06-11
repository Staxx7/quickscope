// app/lib/censusService.ts - U.S. Census Bureau API Service

interface BusinessPattern {
    industry: string;
    naicsCode: string;
    establishments: number;
    employees: number;
    annualPayroll: number;
    geography: string;
  }
  
  interface IndustryDemographics {
    industry: string;
    totalEstablishments: number;
    totalEmployees: number;
    averageEstablishmentSize: number;
    geographicDistribution: any[];
    employeeSizeDistribution: any[];
  }
  
  export class CensusService {
    private apiKey: string;
    private baseURL = 'https://api.census.gov/data';
  
    constructor() {
      this.apiKey = process.env.CENSUS_API_KEY || '';
    }
  
    // Get County Business Patterns data for industry benchmarking
    async getIndustryBusinessPatterns(naicsCode: string, year: string = '2021'): Promise<BusinessPattern[]> {
      try {
        // County Business Patterns API endpoint
        const endpoint = `${this.baseURL}/${year}/cbp`;
        
        const params = new URLSearchParams({
          get: 'GEO_ID,NAME,NAICS2017,NAICS2017_LABEL,EMP,ESTAB,PAYANN',
          for: 'us:*',
          NAICS2017: naicsCode,
          key: this.apiKey
        });
  
        const response = await fetch(`${endpoint}?${params}`);
        
        if (!response.ok) {
          throw new Error(`Census API error: ${response.status}`);
        }
  
        const data = await response.json();
        return this.parseBusinessPatterns(data);
      } catch (error) {
        console.error('Error fetching Census business patterns:', error);
        return [];
      }
    }
  
    private parseBusinessPatterns(data: any[]): BusinessPattern[] {
      if (!data || data.length < 2) return [];
  
      const headers = data[0];
      const rows = data.slice(1);
  
      return rows.map(row => {
        const rowData: { [key: string]: any } = {};
        headers.forEach((header: string, index: number) => {
          rowData[header] = row[index];
        });
  
        return {
          industry: rowData.NAICS2017_LABEL || 'Unknown',
          naicsCode: rowData.NAICS2017 || '',
          establishments: parseInt(rowData.ESTAB) || 0,
          employees: parseInt(rowData.EMP) || 0,
          annualPayroll: parseInt(rowData.PAYANN) || 0,
          geography: rowData.NAME || 'United States'
        };
      });
    }
  
    // Get industry demographics and size distribution
    async getIndustryDemographics(industry: string): Promise<IndustryDemographics | null> {
      try {
        // Map industry to NAICS codes
        const naicsCode = this.mapIndustryToNAICS(industry);
        const businessPatterns = await this.getIndustryBusinessPatterns(naicsCode);
  
        if (businessPatterns.length === 0) return null;
  
        const totalEstablishments = businessPatterns.reduce((sum, bp) => sum + bp.establishments, 0);
        const totalEmployees = businessPatterns.reduce((sum, bp) => sum + bp.employees, 0);
        const averageEstablishmentSize = totalEmployees / totalEstablishments;
  
        return {
          industry,
          totalEstablishments,
          totalEmployees,
          averageEstablishmentSize,
          geographicDistribution: this.analyzeGeographicDistribution(businessPatterns),
          employeeSizeDistribution: this.analyzeEmployeeSizeDistribution(businessPatterns)
        };
      } catch (error) {
        console.error('Error fetching industry demographics:', error);
        return null;
      }
    }
  
    private mapIndustryToNAICS(industry: string): string {
      const industryNAICSMap: { [key: string]: string } = {
        'technology': '51',          // Information
        'healthcare': '62',          // Health Care and Social Assistance  
        'manufacturing': '31-33',    // Manufacturing
        'finance': '52',             // Finance and Insurance
        'professional-services': '54', // Professional, Scientific, and Technical Services
        'retail': '44-45',           // Retail Trade
        'construction': '23',        // Construction
        'education': '61',           // Educational Services
        'hospitality': '72',         // Accommodation and Food Services
        'transportation': '48-49'    // Transportation and Warehousing
      };
  
      return industryNAICSMap[industry.toLowerCase()] || '51';
    }
  
    private analyzeGeographicDistribution(patterns: BusinessPattern[]): any[] {
      // Group by geographic regions and calculate percentages
      const geoDistribution = patterns.reduce((acc: any, pattern) => {
        const region = this.getRegionFromGeography(pattern.geography);
        if (!acc[region]) {
          acc[region] = { establishments: 0, employees: 0 };
        }
        acc[region].establishments += pattern.establishments;
        acc[region].employees += pattern.employees;
        return acc;
      }, {});
  
      const totalEstablishments = Object.values(geoDistribution).reduce((sum: number, region: any) => sum + region.establishments, 0);
  
      return Object.entries(geoDistribution).map(([region, data]: [string, any]) => ({
        region,
        establishments: data.establishments,
        percentage: (data.establishments / totalEstablishments) * 100,
        employees: data.employees
      }));
    }
  
    private analyzeEmployeeSizeDistribution(patterns: BusinessPattern[]): any[] {
      // Categorize establishments by employee size
      const sizeCategories = [
        { label: '1-4 employees', min: 1, max: 4 },
        { label: '5-9 employees', min: 5, max: 9 },
        { label: '10-19 employees', min: 10, max: 19 },
        { label: '20-49 employees', min: 20, max: 49 },
        { label: '50-99 employees', min: 50, max: 99 },
        { label: '100+ employees', min: 100, max: Infinity }
      ];
  
      return sizeCategories.map(category => {
        const establishmentsInCategory = patterns.filter(pattern => {
          const avgSize = pattern.employees / pattern.establishments;
          return avgSize >= category.min && avgSize <= category.max;
        }).reduce((sum, pattern) => sum + pattern.establishments, 0);
  
        return {
          category: category.label,
          establishments: establishmentsInCategory,
          percentage: (establishmentsInCategory / patterns.reduce((sum, p) => sum + p.establishments, 0)) * 100
        };
      });
    }
  
    private getRegionFromGeography(geography: string): string {
      // Simplified region mapping - could be enhanced with state-to-region mapping
      if (geography.includes('United States')) return 'National';
      if (geography.includes('Northeast')) return 'Northeast';
      if (geography.includes('South')) return 'South';
      if (geography.includes('Midwest')) return 'Midwest';
      if (geography.includes('West')) return 'West';
      return 'Other';
    }
  
    // Get economic indicators from American Community Survey
    async getEconomicIndicators(geography: string = 'us'): Promise<any> {
      try {
        const endpoint = `${this.baseURL}/2022/acs/acs5`;
        
        const params = new URLSearchParams({
          get: 'B19013_001E,B08303_001E,B25077_001E,B15003_022E', // Median income, commute time, home value, bachelor's degree
          for: `${geography}:*`,
          key: this.apiKey
        });
  
        const response = await fetch(`${endpoint}?${params}`);
        const data = await response.json();
  
        if (data && data.length > 1) {
          const [medianIncome, avgCommute, homeValue, education] = data[1];
          return {
            medianHouseholdIncome: parseInt(medianIncome) || 0,
            averageCommuteTime: parseFloat(avgCommute) || 0,
            medianHomeValue: parseInt(homeValue) || 0,
            bachelorsDegreePct: parseFloat(education) || 0,
            geography,
            dataSource: 'U.S. Census Bureau - American Community Survey'
          };
        }
  
        return null;
      } catch (error) {
        console.error('Error fetching economic indicators:', error);
        return null;
      }
    }
  }
  