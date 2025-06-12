'use client';
import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, TrendingUp, FileText, Phone, Database, 
  Search, Filter, Eye, Upload, Download, RefreshCw, 
  CheckCircle, Clock, AlertTriangle, ArrowRight, Zap,
  Plus, Settings, Calendar, DollarSign, Activity
} from 'lucide-react';

interface ConnectedAccount {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  connectedDate: string;
  lastSync: string;
  workflowProgress: {
    connected: boolean;
    transcriptUploaded: boolean;
    dataExtracted: boolean;
    analysisComplete: boolean;
    auditDeckReady: boolean;
  };
  financialSnapshot: {
    revenue: string;
    netIncome: string;
    lastUpdate: string;
  };
  nextStep: string;
  priority: 'high' | 'medium' | 'low';
  transcriptCount: number;
  status: 'active' | 'pending' | 'completed';
}

const AccountWorkflowDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO: Replace with real API call to fetch connected QB accounts
  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      try {
        // This should call your actual API endpoint
        // const response = await fetch('/api/connected-accounts');
        // const data = await response.json();
        
        // Mock data for now - replace with real data
        const mockAccounts: ConnectedAccount[] = [
          {
            id: '1',
            companyName: 'TechCorp Solutions',
            contactName: 'Sarah Johnson',
            contactEmail: 'sarah@techcorp.com',
            connectedDate: '2024-01-15',
            lastSync: '2 hours ago',
            workflowProgress: {
              connected: true,
              transcriptUploaded: false,
              dataExtracted: true,
              analysisComplete: false,
              auditDeckReady: false
            },
            financialSnapshot: {
              revenue: '$2,840,000',
              netIncome: '$684,000',
              lastUpdate: '2 hours ago'
            },
            nextStep: 'Upload discovery call transcript',
            priority: 'high',
            transcriptCount: 0,
            status: 'active'
          },
          {
            id: '2',
            companyName: 'Global Manufacturing Inc',
            contactName: 'Michael Chen',
            contactEmail: 'mchen@globalmfg.com',
            connectedDate: '2024-01-10',
            lastSync: '4 hours ago',
            workflowProgress: {
              connected: true,
              transcriptUploaded: true,
              dataExtracted: true,
              analysisComplete: true,
              auditDeckReady: false
            },
            financialSnapshot: {
              revenue: '$5,200,000',
              netIncome: '$520,000',
              lastUpdate: '4 hours ago'
            },
            nextStep: 'Generate audit deck',
            priority: 'high',
            transcriptCount: 2,
            status: 'active'
          },
          {
            id: '3',
            companyName: 'Healthcare Plus',
            contactName: 'Emily Rodriguez',
            contactEmail: 'emily@healthcareplus.com',
            connectedDate: '2024-01-05',
            lastSync: '1 day ago',
            workflowProgress: {
              connected: true,
              transcriptUploaded: true,
              dataExtracted: true,
              analysisComplete: true,
              auditDeckReady: true
            },
            financialSnapshot: {
              revenue: '$3,600,000',
              netIncome: '$360,000',
              lastUpdate: '1 day ago'
            },
            nextStep: 'Review and deliver audit deck',
            priority: 'medium',
            transcriptCount: 5,
            status: 'completed'
          },
          {
            id: '4',
            companyName: 'RetailMax',
            contactName: 'David Thompson',
            contactEmail: 'david@retailmax.com',
            connectedDate: '2024-01-20',
            lastSync: '30 minutes ago',
            workflowProgress: {
              connected: true,
              transcriptUploaded: false,
              dataExtracted: false,
              analysisComplete: false,
              auditDeckReady: false
            },
            financialSnapshot: {
              revenue: '$2,500,000',
              netIncome: '$250,000',
              lastUpdate: '30 minutes ago'
            },
            nextStep: 'Schedule discovery call',
            priority: 'medium',
            transcriptCount: 0,
            status: 'pending'
          },
          {
            id: '5',
            companyName: 'Financial Services Group',
            contactName: 'Amanda Foster',
            contactEmail: 'amanda@fsg.com',
            connectedDate: '2024-01-18',
            lastSync: '5 hours ago',
            workflowProgress: {
              connected: true,
              transcriptUploaded: true,
              dataExtracted: true,
              analysisComplete: false,
              auditDeckReady: false
            },
            financialSnapshot: {
              revenue: '$9,500,000',
              netIncome: '$950,000',
              lastUpdate: '5 hours ago'
            },
            nextStep: 'Schedule follow-up presentation',
            priority: 'high',
            transcriptCount: 8,
            status: 'active'
          }
        ];

        // Simulate loading delay
        setTimeout(() => {
          setAccounts(mockAccounts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching connected accounts:', error);
        setLoading(false);
      }
    };

    fetchConnectedAccounts();
  }, []);

  const getWorkflowProgress = (progress: ConnectedAccount['workflowProgress']) => {
    const steps = Object.values(progress);
    const completed = steps.filter(Boolean).length;
    return (completed / steps.length) * 100;
  };

  const getWorkflowStep = (progress: ConnectedAccount['workflowProgress']) => {
    if (!progress.connected) return { step: 1, total: 5 };
    if (!progress.transcriptUploaded) return { step: 2, total: 5 };
    if (!progress.dataExtracted) return { step: 3, total: 5 };
    if (!progress.analysisComplete) return { step: 4, total: 5 };
    if (!progress.auditDeckReady) return { step: 5, total: 5 };
    return { step: 5, total: 5 };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-slate-200 bg-slate-700/40 border-slate-600/30';
      case 'medium': return 'text-slate-300 bg-slate-800/40 border-slate-700/30';
      case 'low': return 'text-slate-400 bg-slate-800/20 border-slate-700/20';
      default: return 'text-slate-400 bg-slate-800/20 border-slate-700/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-cyan-300 bg-cyan-500/10 border-cyan-500/20';
      case 'pending': return 'text-slate-300 bg-slate-600/20 border-slate-600/30';
      case 'completed': return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-700/20 border-slate-600/20';
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || account.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const workflowStats = {
    totalAccounts: accounts.length,
    readyForTranscripts: accounts.filter(a => a.workflowProgress.connected && !a.workflowProgress.transcriptUploaded).length,
    readyForAudit: accounts.filter(a => a.workflowProgress.analysisComplete && !a.workflowProgress.auditDeckReady).length,
    completed: accounts.filter(a => a.workflowProgress.auditDeckReady).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-600/30 border-t-slate-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-lg">Loading connected accounts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Workflow Stats - Simplified */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <Building2 className="w-7 h-7 text-slate-400" />
            <span className="text-3xl font-light text-white">{workflowStats.totalAccounts}</span>
          </div>
          <p className="text-slate-300 text-sm font-medium">Total Accounts</p>
          <p className="text-slate-400 text-xs mt-1">Connected QuickBooks</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <Upload className="w-7 h-7 text-slate-400" />
            <span className="text-3xl font-light text-white">{workflowStats.readyForTranscripts}</span>
          </div>
          <p className="text-slate-300 text-sm font-medium">Ready for Transcripts</p>
          <p className="text-slate-400 text-xs mt-1">Need call uploads</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-7 h-7 text-slate-400" />
            <span className="text-3xl font-light text-white">{workflowStats.readyForAudit}</span>
          </div>
          <p className="text-slate-300 text-sm font-medium">Ready for Audit</p>
          <p className="text-slate-400 text-xs mt-1">Can generate decks</p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-7 h-7 text-emerald-400/70" />
            <span className="text-3xl font-light text-white">{workflowStats.completed}</span>
          </div>
          <p className="text-slate-300 text-sm font-medium">Completed</p>
          <p className="text-slate-400 text-xs mt-1">Audit decks ready</p>
        </div>
      </div>

      {/* Search and Filters - Simplified */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search accounts, contacts, industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-cyan-400/50 transition-all"
          >
            <option value="all" className="bg-slate-800">All Stages</option>
            <option value="pending" className="bg-slate-800">Pending</option>
            <option value="active" className="bg-slate-800">Active</option>
            <option value="completed" className="bg-slate-800">Completed</option>
          </select>
        </div>
      </div>

      {/* Connected Accounts Table - Refined */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-light text-white">Connected Accounts ({filteredAccounts.length})</h2>
            <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">Account</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">Workflow Progress</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">Financial Snapshot</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">Next Step</th>
                <th className="text-left py-4 px-6 text-slate-300 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => {
                const progressPercent = getWorkflowProgress(account.workflowProgress);
                const currentStep = getWorkflowStep(account.workflowProgress);
                
                return (
                  <tr key={account.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-slate-300" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{account.companyName}</div>
                          <div className="text-slate-400 text-sm">{account.contactName}</div>
                          <div className="text-slate-500 text-xs">Connected {account.connectedDate}</div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 text-sm">Step {currentStep.step}/{currentStep.total}</span>
                          <span className={`px-2 py-1 rounded-full text-xs border font-medium ${getStatusColor(account.status)}`}>
                            {account.status}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700/30 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-slate-400 to-slate-300 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="grid grid-cols-5 gap-1.5 mt-2">
                          <div className={`w-2 h-2 rounded-full ${account.workflowProgress.connected ? 'bg-emerald-400/70' : 'bg-slate-600'}`} title="Connected" />
                          <div className={`w-2 h-2 rounded-full ${account.workflowProgress.transcriptUploaded ? 'bg-emerald-400/70' : 'bg-slate-600'}`} title="Transcript Uploaded" />
                          <div className={`w-2 h-2 rounded-full ${account.workflowProgress.dataExtracted ? 'bg-emerald-400/70' : 'bg-slate-600'}`} title="Data Extracted" />
                          <div className={`w-2 h-2 rounded-full ${account.workflowProgress.analysisComplete ? 'bg-emerald-400/70' : 'bg-slate-600'}`} title="Analysis Complete" />
                          <div className={`w-2 h-2 rounded-full ${account.workflowProgress.auditDeckReady ? 'bg-emerald-400/70' : 'bg-slate-600'}`} title="Audit Deck Ready" />
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      <div className="space-y-1">
                        <div className="text-white font-medium">Revenue: {account.financialSnapshot.revenue}</div>
                        <div className="text-slate-300 text-sm">Net: {account.financialSnapshot.netIncome}</div>
                        <div className="text-slate-500 text-xs">Last sync: {account.lastSync}</div>
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      <div className="space-y-2">
                        <div className="text-white text-sm">{account.nextStep}</div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(account.priority)}`}>
                            {account.priority}
                          </span>
                          {account.transcriptCount > 0 && (
                            <span className="text-slate-400 text-xs">
                              {account.transcriptCount} transcripts
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-5 px-6">
                      <div className="flex items-center space-x-1">
                        <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5" title="Upload Transcript">
                          <Upload className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5" title="Generate Report">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountWorkflowDashboard;
