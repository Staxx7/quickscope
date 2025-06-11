"use client"
import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign, FileText, Plus, Search, Filter, 
         Eye, Calendar, Phone, Mail, Building, MessageSquare, BarChart3,
         Database, Zap, Download, CheckCircle, Clock, AlertTriangle, 
         Settings, Target, PieChart, RefreshCw, Edit, Trash2 } from 'lucide-react';

interface Prospect {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  stage: 'connected' | 'analyzing' | 'audit-scheduled' | 'audit-complete' | 'closed-won' | 'closed-lost';
  connectedAt: Date;
  lastActivity: Date;
  estimatedRevenue: number;
  qbCompanyId?: string;
  hasTranscripts: boolean;
  analysisComplete: boolean;
  priority: 'high' | 'medium' | 'low';
  source: string;
  notes: string;
  nextAction: string;
  assignedTo: string;
}

interface ProspectDetails {
  prospect: Prospect;
  financialSummary: {
    revenue: number;
    growth: number;
    healthScore: number;
    riskLevel: string;
  };
  recentActivity: string[];
  transcriptCount: number;
  reportCount: number;
}

export default function AdminMainDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'prospects' | 'analytics' | 'transcripts' | 'reports'>('overview');
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [showAddProspect, setShowAddProspect] = useState(false);
  const [showProspectDetails, setShowProspectDetails] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [newProspect, setNewProspect] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: '',
    estimatedRevenue: '',
    priority: 'medium',
    notes: '',
    source: 'manual'
  });

  // Load prospects from localStorage and add mock data
  useEffect(() => {
    const savedProspects = localStorage.getItem('quickscope_prospects');
    const loadedProspects = savedProspects ? JSON.parse(savedProspects) : [];
    
    // Add mock prospects for demonstration
    const mockProspects: Prospect[] = [
      {
        id: '1',
        companyName: 'TechCorp Solutions',
        contactName: 'Sarah Johnson',
        email: 'sarah@techcorp.com',
        phone: '(555) 123-4567',
        industry: 'Technology',
        stage: 'audit-complete',
        connectedAt: new Date('2024-05-15'),
        lastActivity: new Date('2024-06-01'),
        estimatedRevenue: 15000,
        qbCompanyId: 'qb_123456',
        hasTranscripts: true,
        analysisComplete: true,
        priority: 'high',
        source: 'website',
        notes: 'Interested in comprehensive financial analysis and forecasting tools',
        nextAction: 'Send final proposal by Friday',
        assignedTo: 'Mike Chen'
      },
      {
        id: '2',
        companyName: 'Manufacturing Inc',
        contactName: 'Mike Chen',
        email: 'mike@manufacturing.com',
        phone: '(555) 987-6543',
        industry: 'Manufacturing',
        stage: 'analyzing',
        connectedAt: new Date('2024-05-28'),
        lastActivity: new Date('2024-05-30'),
        estimatedRevenue: 25000,
        qbCompanyId: 'qb_789012',
        hasTranscripts: true,
        analysisComplete: false,
        priority: 'high',
        source: 'referral',
        notes: 'Needs help with inventory management and cost analysis',
        nextAction: 'Complete financial analysis by Tuesday',
        assignedTo: 'Sarah Williams'
      },
      {
        id: '3',
        companyName: 'Retail Solutions LLC',
        contactName: 'Amanda Rodriguez',
        email: 'amanda@retailsolutions.com',
        phone: '(555) 456-7890',
        industry: 'Retail',
        stage: 'connected',
        connectedAt: new Date('2024-06-05'),
        lastActivity: new Date('2024-06-05'),
        estimatedRevenue: 8000,
        qbCompanyId: 'qb_345678',
        hasTranscripts: false,
        analysisComplete: false,
        priority: 'medium',
        source: 'website',
        notes: 'Small retail chain looking for basic financial reporting',
        nextAction: 'Schedule discovery call',
        assignedTo: 'David Kim'
      },
      {
        id: '4',
        companyName: 'StartupXYZ',
        contactName: 'Alex Thompson',
        email: 'alex@startupxyz.com',
        phone: '(555) 321-9876',
        industry: 'SaaS',
        stage: 'audit-scheduled',
        connectedAt: new Date('2024-06-03'),
        lastActivity: new Date('2024-06-07'),
        estimatedRevenue: 35000,
        qbCompanyId: 'qb_567890',
        hasTranscripts: true,
        analysisComplete: true,
        priority: 'high',
        source: 'linkedin',
        notes: 'Fast-growing startup preparing for Series A funding',
        nextAction: 'Present audit deck on Monday',
        assignedTo: 'Mike Chen'
      }
    ];

    // Merge loaded prospects with mock data (avoid duplicates)
    const allProspects = [...mockProspects, ...loadedProspects.filter(
      (loaded: Prospect) => !mockProspects.some(mock => mock.id === loaded.id)
    )];

    setProspects(allProspects);
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'connected': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'analyzing': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'audit-scheduled': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'audit-complete': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'closed-won': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'closed-lost': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-300 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-amber-300 bg-amber-500/20 border-amber-500/30';
      case 'low': return 'text-green-300 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-300 bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleViewDetails = (prospect: Prospect) => {
    setSelectedProspect(prospect);
    setShowProspectDetails(true);
  };

  const handleStageChange = (prospectId: string, newStage: string) => {
    setProspects(prev => prev.map(p => 
      p.id === prospectId 
        ? { ...p, stage: newStage as Prospect['stage'], lastActivity: new Date() }
        : p
    ));
    
    // Update localStorage
    const updatedProspects = prospects.map(p => 
      p.id === prospectId 
        ? { ...p, stage: newStage as Prospect['stage'], lastActivity: new Date() }
        : p
    );
    localStorage.setItem('quickscope_prospects', JSON.stringify(updatedProspects));
  };

  const handleAddProspect = () => {
    if (!newProspect.companyName || !newProspect.contactName || !newProspect.email) {
      alert('Please fill in required fields: Company Name, Contact Name, and Email');
      return;
    }

    const prospect: Prospect = {
      id: Date.now().toString(),
      companyName: newProspect.companyName,
      contactName: newProspect.contactName,
      email: newProspect.email,
      phone: newProspect.phone,
      industry: newProspect.industry,
      stage: 'connected',
      connectedAt: new Date(),
      lastActivity: new Date(),
      estimatedRevenue: parseInt(newProspect.estimatedRevenue) || 0,
      hasTranscripts: false,
      analysisComplete: false,
      priority: newProspect.priority as 'high' | 'medium' | 'low',
      source: newProspect.source,
      notes: newProspect.notes,
      nextAction: 'Initial contact and discovery call',
      assignedTo: 'Unassigned'
    };

    setProspects(prev => [prospect, ...prev]);
    
    // Update localStorage
    const updatedProspects = [prospect, ...prospects];
    localStorage.setItem('quickscope_prospects', JSON.stringify(updatedProspects));
    
    // Reset form
    setNewProspect({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      industry: '',
      estimatedRevenue: '',
      priority: 'medium',
      notes: '',
      source: 'manual'
    });
    setShowAddProspect(false);
  };

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prospect.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || prospect.stage === stageFilter;
    const matchesPriority = priorityFilter === 'all' || prospect.priority === priorityFilter;
    return matchesSearch && matchesStage && matchesPriority;
  });

  // Calculate dashboard metrics
  const totalProspects = prospects.length;
  const totalRevenue = prospects.reduce((sum, p) => sum + p.estimatedRevenue, 0);
  const activeProspects = prospects.filter(p => !['closed-won', 'closed-lost'].includes(p.stage)).length;
  const completedAnalyses = prospects.filter(p => p.analysisComplete).length;

  const stageDistribution = [
    { stage: 'connected', count: prospects.filter(p => p.stage === 'connected').length },
    { stage: 'analyzing', count: prospects.filter(p => p.stage === 'analyzing').length },
    { stage: 'audit-scheduled', count: prospects.filter(p => p.stage === 'audit-scheduled').length },
    { stage: 'audit-complete', count: prospects.filter(p => p.stage === 'audit-complete').length }
  ];

  const recentActivity = [
    { action: 'New prospect connected', prospect: 'StartupXYZ', time: '2 hours ago', type: 'connected' },
    { action: 'Financial analysis completed', prospect: 'TechCorp Solutions', time: '4 hours ago', type: 'analysis' },
    { action: 'Audit deck generated', prospect: 'Manufacturing Inc', time: '1 day ago', type: 'report' },
    { action: 'Call transcript uploaded', prospect: 'Retail Solutions LLC', time: '2 days ago', type: 'transcript' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">QS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Sales Team Dashboard</h1>
              <p className="text-gray-300">Manage prospects, track financial analyses, and monitor pipeline progress</p>
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="px-6">
          <nav className="flex space-x-1 backdrop-blur-xl bg-white/5 p-1 rounded-2xl border border-white/10 w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'prospects', label: 'Prospects Pipeline', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'transcripts', label: 'Call Transcripts', icon: MessageSquare },
              { id: 'reports', label: 'Reports', icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === id
                    ? 'bg-white/20 text-white border border-white/20 shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-300">Total Prospects</h3>
                    <p className="text-2xl font-bold text-white">{totalProspects}</p>
                  </div>
                </div>
              </div>
              
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-300">Pipeline Value</h3>
                    <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-300">Active Prospects</h3>
                    <p className="text-2xl font-bold text-white">{activeProspects}</p>
                  </div>
                </div>
              </div>
              
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20">
                    <FileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-300">Analyses Complete</h3>
                    <p className="text-2xl font-bold text-white">{completedAnalyses}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pipeline Stage Distribution */}
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Pipeline Stage Distribution</h2>
                <div className="space-y-4">
                  {stageDistribution.map(({ stage, count }) => (
                    <div key={stage} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-white capitalize w-32">
                          {stage.replace('-', ' ')}
                        </div>
                        <div className="flex-1 mx-4">
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${totalProspects > 0 ? (count / totalProspects) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-white w-8 text-right">{count}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`p-2 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 ${
                        activity.type === 'connected' ? 'text-blue-400' :
                        activity.type === 'analysis' ? 'text-green-400' :
                        activity.type === 'report' ? 'text-purple-400' :
                        'text-yellow-400'
                      }`}>
                        {activity.type === 'connected' && <Users className="w-3 h-3" />}
                        {activity.type === 'analysis' && <BarChart3 className="w-3 h-3" />}
                        {activity.type === 'report' && <FileText className="w-3 h-3" />}
                        {activity.type === 'transcript' && <MessageSquare className="w-3 h-3" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium">{activity.action}</p>
                        <p className="text-xs text-gray-400">{activity.prospect} • {activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <button
                  onClick={() => window.open('/admin/dashboard/data-extraction', '_blank')}
                  className="flex items-center gap-3 p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <Database className="w-6 h-6 text-blue-400" />
                  <div className="text-left">
                    <div className="font-medium text-white">Data Extraction</div>
                    <div className="text-sm text-gray-400">Extract financial data</div>
                  </div>
                </button>
                
                <button
                  onClick={() => window.open('/admin/dashboard/advanced-analysis', '_blank')}
                  className="flex items-center gap-3 p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <BarChart3 className="w-6 h-6 text-green-400" />
                  <div className="text-left">
                    <div className="font-medium text-white">Advanced Analysis</div>
                    <div className="text-sm text-gray-400">AI-powered insights</div>
                  </div>
                </button>
                
                <button
                  onClick={() => window.open('/admin/dashboard/report-generation', '_blank')}
                  className="flex items-center gap-3 p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <FileText className="w-6 h-6 text-purple-400" />
                  <div className="text-left">
                    <div className="font-medium text-white">Generate Reports</div>
                    <div className="text-sm text-gray-400">Create audit decks</div>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('transcripts')}
                  className="flex items-center gap-3 p-4 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <MessageSquare className="w-6 h-6 text-orange-400" />
                  <div className="text-left">
                    <div className="font-medium text-white">Upload Transcripts</div>
                    <div className="text-sm text-gray-400">Add call context</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prospects Tab */}
        {activeTab === 'prospects' && (
          <div className="space-y-6">
            {/* Header with Search and Add */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search prospects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  />
                </div>
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="all" className="bg-slate-800">All Stages</option>
                  <option value="connected" className="bg-slate-800">Connected</option>
                  <option value="analyzing" className="bg-slate-800">Analyzing</option>
                  <option value="audit-scheduled" className="bg-slate-800">Audit Scheduled</option>
                  <option value="audit-complete" className="bg-slate-800">Audit Complete</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="all" className="bg-slate-800">All Priorities</option>
                  <option value="high" className="bg-slate-800">High Priority</option>
                  <option value="medium" className="bg-slate-800">Medium Priority</option>
                  <option value="low" className="bg-slate-800">Low Priority</option>
                </select>
              </div>
              <button
                onClick={() => setShowAddProspect(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Add Prospect
              </button>
            </div>

            {/* Prospects Table */}
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="backdrop-blur-sm bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Stage
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredProspects.map((prospect) => (
                      <tr key={prospect.id} className="hover:bg-white/5 transition-all duration-300">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                              <Building className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{prospect.companyName}</div>
                              <div className="text-sm text-gray-400">{prospect.industry}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{prospect.contactName}</div>
                          <div className="text-sm text-gray-400">{prospect.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={prospect.stage}
                            onChange={(e) => handleStageChange(prospect.id, e.target.value)}
                            className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer transition-all duration-300 border ${getStageColor(prospect.stage)} bg-transparent backdrop-blur-sm`}
                          >
                            <option value="connected" className="bg-slate-800">Connected</option>
                            <option value="analyzing" className="bg-slate-800">Analyzing</option>
                            <option value="audit-scheduled" className="bg-slate-800">Audit Scheduled</option>
                            <option value="audit-complete" className="bg-slate-800">Audit Complete</option>
                            <option value="closed-won" className="bg-slate-800">Closed Won</option>
                            <option value="closed-lost" className="bg-slate-800">Closed Lost</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          ${prospect.estimatedRevenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(prospect.priority)}`}>
                            {prospect.priority.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {prospect.analysisComplete ? (
                              <div title="Analysis Complete">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              </div>
                            ) : (
                              <div title="Analysis Pending">
                                <Clock className="w-4 h-4 text-yellow-400" />
                              </div>
                            )}
                            {prospect.hasTranscripts ? (
                              <div title="Has Transcripts">
                                <MessageSquare className="w-4 h-4 text-blue-400" />
                              </div>
                            ) : (
                              <div title="No Transcripts">
                                <MessageSquare className="w-4 h-4 text-gray-600" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleViewDetails(prospect)}
                              className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProspects.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-500" />
                  <h3 className="mt-2 text-sm font-medium text-white">No prospects found</h3>
                  <p className="mt-1 text-sm text-gray-400">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Analytics Dashboard</h2>
              <p className="text-gray-300 mb-4">
                Detailed analytics and performance metrics will be displayed here. This includes:
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Conversion rates by stage</li>
                <li>• Average deal size and cycle time</li>
                <li>• Revenue forecasting</li>
                <li>• Team performance metrics</li>
                <li>• Client satisfaction scores</li>
              </ul>
              <div className="mt-6">
                <button
                  onClick={() => window.open('/admin/dashboard/financial-analysis', '_blank')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
                >
                  <BarChart3 className="w-5 h-5" />
                  Open Advanced Analytics
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call Transcripts Tab */}
        {activeTab === 'transcripts' && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Call Transcript Integration</h2>
              <p className="text-gray-300 mb-4">
                Upload and manage call transcripts to enhance financial analysis with contextual insights.
              </p>
              <button
                onClick={() => window.open('/admin/dashboard/call-transcripts', '_blank')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <MessageSquare className="w-5 h-5" />
                Open Transcript Manager
              </button>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Report Management</h2>
              <p className="text-gray-300 mb-4">
                Generate and manage financial reports, audit decks, and client presentations.
              </p>
              <button
                onClick={() => window.open('/admin/dashboard/report-generation', '_blank')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <FileText className="w-5 h-5" />
                Open Report Generator
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Prospect Modal */}
      {showAddProspect && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Add New Prospect</h3>
                <button
                  onClick={() => setShowAddProspect(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={newProspect.companyName}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    value={newProspect.contactName}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, contactName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newProspect.email}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newProspect.phone}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Industry</label>
                  <select
                    value={newProspect.industry}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  >
                    <option value="" className="bg-slate-800">Select industry</option>
                    <option value="Technology" className="bg-slate-800">Technology</option>
                    <option value="Manufacturing" className="bg-slate-800">Manufacturing</option>
                    <option value="Retail" className="bg-slate-800">Retail</option>
                    <option value="Healthcare" className="bg-slate-800">Healthcare</option>
                    <option value="Finance" className="bg-slate-800">Finance</option>
                    <option value="Other" className="bg-slate-800">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Estimated Revenue</label>
                  <input
                    type="number"
                    value={newProspect.estimatedRevenue}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, estimatedRevenue: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                    placeholder="Enter estimated revenue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Priority</label>
                  <select
                    value={newProspect.priority}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  >
                    <option value="low" className="bg-slate-800">Low</option>
                    <option value="medium" className="bg-slate-800">Medium</option>
                    <option value="high" className="bg-slate-800">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">Source</label>
                  <select
                    value={newProspect.source}
                    onChange={(e) => setNewProspect(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  >
                    <option value="manual" className="bg-slate-800">Manual Entry</option>
                    <option value="website" className="bg-slate-800">Website</option>
                    <option value="referral" className="bg-slate-800">Referral</option>
                    <option value="linkedin" className="bg-slate-800">LinkedIn</option>
                    <option value="email" className="bg-slate-800">Email Campaign</option>
                    <option value="event" className="bg-slate-800">Event</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Notes</label>
                <textarea
                  value={newProspect.notes}
                  onChange={(e) => setNewProspect(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter any additional notes"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => setShowAddProspect(false)}
                  className="px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-gray-300 hover:bg-white/20 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProspect}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                  Add Prospect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prospect Details Modal */}
      {showProspectDetails && selectedProspect && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl w-full max-w-4xl max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Prospect Details: {selectedProspect.companyName}</h3>
                <button
                  onClick={() => setShowProspectDetails(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Contact Information</h4>
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl space-y-2 border border-white/10">
                    <div><strong className="text-white">Company:</strong> <span className="text-gray-300">{selectedProspect.companyName}</span></div>
                    <div><strong className="text-white">Contact:</strong> <span className="text-gray-300">{selectedProspect.contactName}</span></div>
                    <div><strong className="text-white">Email:</strong> <span className="text-gray-300">{selectedProspect.email}</span></div>
                    <div><strong className="text-white">Phone:</strong> <span className="text-gray-300">{selectedProspect.phone}</span></div>
                    <div><strong className="text-white">Industry:</strong> <span className="text-gray-300">{selectedProspect.industry}</span></div>
                    <div><strong className="text-white">Connected:</strong> <span className="text-gray-300">{selectedProspect.connectedAt.toLocaleDateString()}</span></div>
                    <div><strong className="text-white">Last Activity:</strong> <span className="text-gray-300">{selectedProspect.lastActivity.toLocaleDateString()}</span></div>
                  </div>
                  
                  <h4 className="font-medium text-white">Pipeline Information</h4>
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl space-y-2 border border-white/10">
                    <div><strong className="text-white">Stage:</strong> <span className={`ml-2 px-2 py-1 rounded text-xs border ${getStageColor(selectedProspect.stage)}`}>{selectedProspect.stage}</span></div>
                    <div><strong className="text-white">Priority:</strong> <span className={`ml-2 px-2 py-1 rounded text-xs border ${getPriorityColor(selectedProspect.priority)}`}>{selectedProspect.priority}</span></div>
                    <div><strong className="text-white">Estimated Revenue:</strong> <span className="text-gray-300 font-medium">${selectedProspect.estimatedRevenue.toLocaleString()}</span></div>
                    <div><strong className="text-white">Source:</strong> <span className="text-gray-300">{selectedProspect.source}</span></div>
                    <div><strong className="text-white">Assigned To:</strong> <span className="text-gray-300">{selectedProspect.assignedTo}</span></div>
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-white">Status & Analysis</h4>
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl space-y-2 border border-white/10">
                    <div className="flex items-center">
                      <strong className="mr-2 text-white">QuickBooks Connected:</strong>
                      {selectedProspect.qbCompanyId ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div className="flex items-center">
                      <strong className="mr-2 text-white">Analysis Complete:</strong>
                      {selectedProspect.analysisComplete ? (
                        <div title="Analysis Complete">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                      ) : (
                        <div title="Analysis Pending">
                          <Clock className="w-4 h-4 text-yellow-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <strong className="mr-2 text-white">Has Transcripts:</strong>
                      {selectedProspect.hasTranscripts ? (
                        <div title="Has Transcripts">
                          <MessageSquare className="w-4 h-4 text-blue-400" />
                        </div>
                      ) : (
                        <div title="No Transcripts">
                          <MessageSquare className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  </div>

                  <h4 className="font-medium text-white">Notes & Next Actions</h4>
                  <div className="backdrop-blur-sm bg-white/5 p-4 rounded-xl space-y-2 border border-white/10">
                    <div><strong className="text-white">Notes:</strong><br /><span className="text-gray-300">{selectedProspect.notes || 'No notes available'}</span></div>
                    <div><strong className="text-white">Next Action:</strong><br /><span className="text-gray-300">{selectedProspect.nextAction}</span></div>
                  </div>

                  <h4 className="font-medium text-white">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => window.open('/admin/dashboard/advanced-analysis', '_blank')}
                      className="flex items-center gap-2 p-3 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      <BarChart3 className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-white">View Analysis</span>
                    </button>
                    <button
                      onClick={() => window.open('/admin/dashboard/report-generation', '_blank')}
                      className="flex items-center gap-2 p-3 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      <FileText className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-white">Generate Report</span>
                    </button>
                    <button
                      onClick={() => window.open('/admin/dashboard/call-transcripts', '_blank')}
                      className="flex items-center gap-2 p-3 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-white">View Transcripts</span>
                    </button>
                    <button
                      onClick={() => window.open('/admin/dashboard/data-extraction', '_blank')}
                      className="flex items-center gap-2 p-3 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                    >
                      <Database className="w-4 h-4 text-orange-400" />
                      <span className="text-sm text-white">Extract Data</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}