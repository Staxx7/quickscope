'use client'

import React from 'react';
import { useCompany, useLiveData } from '../contexts/CompanyContext';
import { Building2, Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

const GlobalCompanyStatus: React.FC = () => {
  const { selectedCompany, connectedCompanies, isLoading, error } = useCompany();
  const { ensureDataIsFresh, ensureLiveData } = useLiveData();

  const getDataFreshnessStatus = () => {
    if (!selectedCompany?.last_sync) return 'never';
    
    const lastSync = new Date(selectedCompany.last_sync);
    const now = new Date();
    const ageMinutes = (now.getTime() - lastSync.getTime()) / (1000 * 60);
    
    if (ageMinutes < 5) return 'fresh';
    if (ageMinutes < 30) return 'recent';
    if (ageMinutes < 120) return 'stale';
    return 'old';
  };

  const getStatusColor = () => {
    if (error) return 'bg-red-500/10 border-red-500/30 text-red-400';
    if (!selectedCompany) return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
    
    const freshness = getDataFreshnessStatus();
    switch (freshness) {
      case 'fresh': return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'recent': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'stale': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'old': return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      case 'never': return 'bg-red-500/10 border-red-500/30 text-red-400';
    }
  };

  const getStatusIcon = () => {
    if (error) return <AlertTriangle className="w-4 h-4" />;
    if (!selectedCompany) return <Building2 className="w-4 h-4" />;
    
    const freshness = getDataFreshnessStatus();
    switch (freshness) {
      case 'fresh': return <CheckCircle className="w-4 h-4" />;
      case 'recent': return <Wifi className="w-4 h-4" />;
      case 'stale': return <WifiOff className="w-4 h-4" />;
      case 'old': return <RefreshCw className="w-4 h-4" />;
      case 'never': return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusMessage = () => {
    if (error) return `Error: ${error}`;
    if (isLoading) return 'Loading companies...';
    if (!selectedCompany) return 'Please select a company';
    
    const freshness = getDataFreshnessStatus();
    const companyName = selectedCompany.name;
    
    switch (freshness) {
      case 'fresh': return `${companyName} • Live data active`;
      case 'recent': return `${companyName} • Data current`;
      case 'stale': return `${companyName} • Data needs refresh`;
      case 'old': return `${companyName} • Data outdated`;
      case 'never': return `${companyName} • No sync yet`;
    }
  };

  const handleRefreshData = async () => {
    if (selectedCompany) {
      await ensureDataIsFresh(0); // Force refresh
    }
  };

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg px-3 py-2 z-50">
        <div className="flex items-center space-x-2 text-slate-300">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed top-4 right-4 backdrop-blur-sm border rounded-lg px-3 py-2 z-50 ${getStatusColor()}`}>
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusMessage()}</span>
        
        {selectedCompany && ensureLiveData && (
          <button
            onClick={handleRefreshData}
            className="ml-2 p-1 rounded hover:bg-white/10 transition-colors"
            title="Refresh live data"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        )}
      </div>
      
      {selectedCompany && (
        <div className="text-xs opacity-75 mt-1">
          {connectedCompanies.length} companies connected • 
          {selectedCompany.last_sync 
            ? ` Last sync: ${new Date(selectedCompany.last_sync).toLocaleTimeString()}`
            : ' Never synced'
          }
        </div>
      )}
    </div>
  );
};

export default GlobalCompanyStatus; 