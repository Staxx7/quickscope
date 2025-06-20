'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode, Suspense } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

// This is the comprehensive, unified Company object
export interface Company {
  id: string;
  name: string;
  realmId?: string; // a.k.a. company_id from qbo_tokens
  status?: 'active' | 'expired' | 'error';
  last_sync?: string;
  connected_at?: string;
}

interface CompanyContextType {
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
  isLoading: boolean;
  error: string | null;
  connectedCompanies: Company[];
  refreshCompanies: () => Promise<void>;
  syncCompanyData: (companyId: string) => Promise<void>;
  getCompanyById: (id: string) => Company | null;
  ensureLiveData: boolean;
  setEnsureLiveData: (ensure: boolean) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
};

interface CompanyProviderProps {
  children: ReactNode;
  initialCompanyId?: string;
  initialCompanyName?: string;
}

// Dynamic import for search params handling
const SearchParamsHandler = dynamic(
  () => import('./SearchParamsHandler').then(mod => mod.SearchParamsHandler),
  { ssr: false }
);

export const CompanyProvider: React.FC<CompanyProviderProps> = ({ 
  children, 
  initialCompanyId, 
  initialCompanyName 
}) => {
  const [connectedCompanies, setConnectedCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompanyState] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ensureLiveData, setEnsureLiveData] = useState(true); // Always use live data by default

  const router = useRouter();
  const pathname = usePathname();

  // Initial loading state
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Fetch connected companies on mount
  useEffect(() => {
    refreshCompanies();
  }, []);

  // Auto-select company based on initial params or first available
  useEffect(() => {
    if (connectedCompanies.length > 0 && !selectedCompany) {
      if (initialCompanyId) {
        const matchingCompany = connectedCompanies.find(
          company => company.id === initialCompanyId
        );
        if (matchingCompany) {
          setSelectedCompanyState(matchingCompany);
          return;
        }
      }
      
      // Fallback to first active company
      const activeCompany = connectedCompanies.find(company => company.id === initialCompanyId);
      if (activeCompany) {
        setSelectedCompanyState(activeCompany);
      } else {
        setSelectedCompanyState(connectedCompanies[0]);
      }
    }
  }, [connectedCompanies, initialCompanyId, selectedCompany]);

  const refreshCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/prospects');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }
      
      const data = await response.json();
      const companies = data.prospects?.map((prospect: any) => ({
        id: prospect.id,
        name: prospect.company_name,
        realmId: prospect.company_id, // This is the QuickBooks realm ID
        status: prospect.connection_status as 'active' | 'expired' | 'error',
        connected_at: prospect.connection_date,
        last_sync: prospect.last_sync
      })) || [];
      
      setConnectedCompanies(companies);
      
      // Update selected company if it's in the new list
      if (selectedCompany) {
        const updatedSelectedCompany = companies.find(
          (company: Company) => company.id === selectedCompany.id
        );
        if (updatedSelectedCompany) {
          setSelectedCompanyState(updatedSelectedCompany);
        }
      }
      
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedCompany = (company: Company | null) => {
    setSelectedCompanyState(company);
    // URL updates will be handled by SearchParamsHandler
  };

  const syncCompanyData = async (companyId: string) => {
    try {
      const response = await fetch(`/api/qbo/sync/${companyId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ensureLiveData: true,
          syncAll: true // Sync all data types for comprehensive live data
        })
      });
      
      if (response.ok) {
        // Update the company's last sync time
        setConnectedCompanies(prev => prev.map(company => 
          company.id === companyId 
            ? { ...company, last_sync: new Date().toISOString() }
            : company
        ));
      }
    } catch (error) {
      console.error('Error syncing company data:', error);
    }
  };

  const getCompanyById = (id: string): Company | null => {
    return connectedCompanies.find(
      company => company.id === id
    ) || null;
  };

  const value: CompanyContextType = {
    connectedCompanies,
    selectedCompany,
    setSelectedCompany,
    isLoading,
    error,
    refreshCompanies,
    syncCompanyData,
    getCompanyById,
    ensureLiveData,
    setEnsureLiveData
  };

  return (
    <CompanyContext.Provider value={value}>
      <SearchParamsHandler 
        selectedCompany={selectedCompany}
        setSelectedCompany={setSelectedCompanyState}
      />
      {children}
    </CompanyContext.Provider>
  );
};

// Hook for ensuring live data across the application
export const useLiveData = () => {
  const { selectedCompany, ensureLiveData, syncCompanyData } = useCompany();
  
  const ensureDataIsFresh = async (maxAgeMinutes = 30) => {
    if (!selectedCompany || !ensureLiveData) return false;
    
    const lastSync = selectedCompany.last_sync ? new Date(selectedCompany.last_sync) : null;
    const now = new Date();
    const ageMinutes = lastSync ? (now.getTime() - lastSync.getTime()) / (1000 * 60) : Infinity;
    
    if (ageMinutes > maxAgeMinutes) {
      await syncCompanyData(selectedCompany.id);
      return true; // Data was refreshed
    }
    return false; // Data was already fresh
  };
  
  return { ensureDataIsFresh, selectedCompany, ensureLiveData };
}; 