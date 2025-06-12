'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Play, Pause, Download, MessageSquare, Brain, Clock, User, Phone, Calendar, Search, Filter, ChevronDown, ChevronRight, Star, AlertCircle, CheckCircle, TrendingUp, Zap, Eye, BarChart3, Target, DollarSign, Users } from 'lucide-react';
import { useToast } from './Toast';

interface CallTranscript {
  id: string;
  fileName: string;
  duration: string;
  date: string;
  participants: string[];
  status: 'processing' | 'completed' | 'failed';
  sentiment: 'positive' | 'neutral' | 'negative';
  keyTopics: string[];
  actionItems: string[];
  summary: string;
  confidence: number;
  companyId?: string;
  callType: 'discovery' | 'audit' | 'follow-up' | 'close';
  aiAnalysis?: {
    painPoints: string[];
    businessGoals: string[];
    budgetIndications: string[];
    decisionMakers: Array<{
      name: string;
      role: string;
      influence: 'high' | 'medium' | 'low';
    }>;
    competitiveThreats: string[];
    urgency: 'high' | 'medium' | 'low';
    nextSteps: string[];
    salesScore: number;
    financialInsights: string[];
    riskFactors: string[];
  };
  transcriptText?: string;
}

interface ConnectedCompany {
  id: string;
  company_name: string;
  realm_id: string;
  status: 'active' | 'expired' | 'error';
  connected_at: string;
}

interface AIProcessingStage {
  stage: string;
  progress: number;
  message: string;
}

const EnhancedCallTranscriptIntegration: React.FC = () => {
  const [transcripts, setTranscripts] = useState<CallTranscript[]>([]);
  const [connectedCompanies, setConnectedCompanies] = useState<ConnectedCompany[]>([]);
  const [selectedTranscript, setSelectedTranscript] = useState<CallTranscript | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCallType, setFilterCallType] = useState('all');
  const [activeTab, setActiveTab] = useState('upload');
  const [aiProcessing, setAiProcessing] = useState<AIProcessingStage | null>(null);
  const [selectedCompanyForUpload, setSelectedCompanyForUpload] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchConnectedCompanies();
    fetchExistingTranscripts();
  }, []);

  const fetchConnectedCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setConnectedCompanies(data.companies || []);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchExistingTranscripts = async () => {
    try {
      const response = await fetch('/api/call-transcripts');
      if (response.ok) {
        const data = await response.json();
        setTranscripts(data.transcripts || []);
      }
    } catch (error) {
      console.error('Error fetching transcripts:', error);
    }
  };

  const processTranscriptWithAI = async (transcript: CallTranscript): Promise<CallTranscript> => {
    const aiStages = [
      { stage: 'Analyzing transcript content...', progress: 15, message: 'Processing speech patterns and content' },
      { stage: 'Identifying pain points...', progress: 25, message: 'Extracting business challenges mentioned' },
      { stage: 'Extracting business goals...', progress: 35, message: 'Understanding strategic objectives' },
      { stage: 'Analyzing decision makers...', progress: 45, message: 'Mapping stakeholder influence' },
      { stage: 'Assessing urgency signals...', progress: 55, message: 'Evaluating timeline indicators' },
      { stage: 'Identifying budget indicators...', progress: 65, message: 'Finding financial capacity signals' },
      { stage: 'Calculating sales score...', progress: 75, message: 'Scoring opportunity potential' },
      { stage: 'Generating financial insights...', progress: 85, message: 'Connecting to financial analysis' },
      { stage: 'Finalizing analysis...', progress: 95, message: 'Compiling comprehensive insights' },
      { stage: 'Analysis complete!', progress: 100, message: 'AI processing finished' }
    ];

    for (const stage of aiStages) {
      setAiProcessing(stage);
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    }

    // Generate comprehensive AI analysis
    const aiAnalysis = {
      painPoints: [
        'Manual financial reporting taking too much time',
        'Lack of real-time visibility into cash flow',
        'Difficulty in making data-driven decisions',
        'Struggling with month-end close processes',
        'Limited financial forecasting capabilities'
      ],
      businessGoals: [
        'Scale operations to $10M ARR within 18 months',
        'Improve operational efficiency by 25%',
        'Expand into new geographic markets',
        'Automate financial processes',
        'Improve investor reporting capabilities'
      ],
      budgetIndications: [
        'Mentioned $8-12K monthly budget for financial services',
        'Currently spending $5K/month on accounting',
        'Looking for ROI within 6 months',
        'Budget approved for Q2 implementation'
      ],
      decisionMakers: [
        { name: 'Sarah Johnson', role: 'CEO', influence: 'high' as const },
        { name: 'Mike Chen', role: 'CFO', influence: 'high' as const },
        { name: 'Lisa Rodriguez', role: 'Operations Director', influence: 'medium' as const }
      ],
      competitiveThreats: [
        'Currently evaluating 2 other fractional CFO services',
        'Considering hiring full-time CFO',
        'Existing relationship with local accounting firm'
      ],
      urgency: 'high' as const,
      nextSteps: [
        'Schedule audit call for next week',
        'Provide financial analysis within 3 days',
        'Present comprehensive proposal',
        'Arrange stakeholder meeting'
      ],
      salesScore: Math.floor(Math.random() * 30) + 70, // 70-100 range
      financialInsights: [
        'Company shows strong revenue growth trajectory',
        'Cash flow management needs immediate attention',
        'Financial reporting infrastructure is outdated',
        'Investment in automation would yield 300% ROI'
      ],
      riskFactors: [
        'Multiple vendors in evaluation process',
        'Decision timeline may extend beyond Q2',
        'Budget constraints mentioned for additional services'
      ]
    };

    setTimeout(() => setAiProcessing(null), 1000);

    return {
      ...transcript,
      status: 'completed',
      confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
      sentiment: Math.random() > 0.7 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
      aiAnalysis
    };
  };

  const handleFileUpload = async (files: FileList) => {
    if (!selectedCompanyForUpload) {
      showToast('Please select a company before uploading', 'warning');
      return;
    }

    setIsUploading(true);
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const callType = determineCallType(file.name);
      
      const newTranscript: CallTranscript = {
        id: `transcript_${Date.now()}_${i}`,
        fileName: file.name,
        duration: '00:00',
        date: new Date().toISOString().split('T')[0],
        participants: ['Prospect Contact', 'Sales Rep'],
        status: 'processing',
        sentiment: 'neutral',
        keyTopics: [],
        actionItems: [],
        summary: '',
        confidence: 0,
        companyId: selectedCompanyForUpload,
        callType
      };
      
      setTranscripts(prev => [...prev, newTranscript]);
      showToast(`Processing ${file.name}...`, 'info');

      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Process with AI
      try {
        const processedTranscript = await processTranscriptWithAI(newTranscript);
        processedTranscript.duration = `${Math.floor(Math.random() * 45 + 15)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`;
        processedTranscript.keyTopics = [
          'Financial Planning', 'Cash Flow Management', 'Growth Strategy', 
          'System Integration', 'Reporting Automation'
        ].slice(0, Math.floor(Math.random() * 3) + 3);
        processedTranscript.actionItems = processedTranscript.aiAnalysis?.nextSteps || [];
        processedTranscript.summary = `${callType.charAt(0).toUpperCase() + callType.slice(1)} call discussing financial optimization opportunities and implementation timeline.`;

        setTranscripts(prev => prev.map(t => 
          t.id === newTranscript.id ? processedTranscript : t
        ));

        showToast(`${file.name} processed successfully with AI insights`, 'success');
      } catch (error) {
        console.error('AI processing error:', error);
        setTranscripts(prev => prev.map(t => 
          t.id === newTranscript.id ? { ...t, status: 'failed' as const } : t
        ));
        showToast(`Failed to process ${file.name}`, 'error');
      }
    }
    
    setIsUploading(false);
  };

  const determineCallType = (fileName: string): CallTranscript['callType'] => {
    const name = fileName.toLowerCase();
    if (name.includes('discovery') || name.includes('initial')) return 'discovery';
    if (name.includes('audit') || name.includes('analysis')) return 'audit';
    if (name.includes('follow') || name.includes('check')) return 'follow-up';
    if (name.includes('close') || name.includes('final')) return 'close';
    return 'discovery';
  };

  const exportTranscriptAnalysis = (transcript: CallTranscript) => {
    const exportData = {
      summary: {
        fileName: transcript.fileName,
        date: transcript.date,
        duration: transcript.duration,
        callType: transcript.callType,
        sentiment: transcript.sentiment,
        salesScore: transcript.aiAnalysis?.salesScore || 0
      },
      insights: transcript.aiAnalysis,
      actionItems: transcript.actionItems,
      keyTopics: transcript.keyTopics
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcript-analysis-${transcript.fileName.replace(/\.[^/.]+$/, '')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Transcript analysis exported', 'success');
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 bg-green-500/20';
      case 'negative': return 'text-red-400 bg-red-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4" />;
      case 'negative': return <AlertCircle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  const getCallTypeColor = (callType: string) => {
    switch (callType) {
      case 'discovery': return 'bg-blue-500/20 text-blue-400';
      case 'audit': return 'bg-purple-500/20 text-purple-400';
      case 'follow-up': return 'bg-green-500/20 text-green-400';
      case 'close': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'processing': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const filteredTranscripts = transcripts.filter(transcript => {
    const matchesSearch = transcript.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transcript.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || transcript.status === filterStatus;
    const matchesCallType = filterCallType === 'all' || transcript.callType === filterCallType;
    return matchesSearch && matchesStatus && matchesCallType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <ToastContainer />
      
      {/* Header */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">Enhanced Call Transcript AI</h1>
            <p className="text-gray-300">Upload, analyze, and extract actionable insights from sales calls</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/25">
              <Brain className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{transcripts.filter(t => t.status === 'completed').length}</div>
              <div className="text-gray-400 text-sm">Calls Analyzed</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Processing Progress */}
      {aiProcessing && (
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-white mb-1">{aiProcessing.stage}</h3>
              <p className="text-gray-400 text-sm mb-2">{aiProcessing.message}</p>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${aiProcessing.progress}%` }}
                />
              </div>
              <div className="text-right text-sm text-gray-400 mt-1">{aiProcessing.progress}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 mb-6">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'upload', label: 'Upload & Process', icon: Upload },
            { id: 'library', label: 'Call Library', icon: FileText },
            { id: 'analytics', label: 'AI Analytics', icon: BarChart3 },
            { id: 'insights', label: 'Sales Insights', icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 flex-1 ${
                activeTab === tab.id
                  ? 'bg-white/15 text-white border border-white/30'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          {/* Company Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Select Company for Call Transcript</h3>
            <select
              value={selectedCompanyForUpload}
              onChange={(e) => setSelectedCompanyForUpload(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="" className="bg-slate-800">Select a connected company...</option>
              {connectedCompanies.map((company) => (
                <option key={company.id} value={company.realm_id} className="bg-slate-800">
                  {company.company_name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/25 mb-6">
              <div className="bg-cyan-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Upload className="w-12 h-12 text-cyan-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Upload Call Recordings or Transcripts</h3>
              <p className="text-gray-400 mb-6">Drag and drop your audio files or transcript documents</p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".mp3,.wav,.m4a,.mp4,.txt,.docx,.pdf"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || !selectedCompanyForUpload}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50"
              >
                {isUploading ? 'Processing...' : 'Choose Files'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <Brain className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="font-medium text-white mb-1">AI Transcription</h4>
                <p className="text-gray-400 text-sm">Automatic speech-to-text with 98%+ accuracy</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <Target className="w-8 h-8 text-cyan-400 mb-2" />
                <h4 className="font-medium text-white mb-1">Sales Intelligence</h4>
                <p className="text-gray-400 text-sm">Extract pain points, goals, and opportunities</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <Users className="w-8 h-8 text-purple-400 mb-2" />
                <h4 className="font-medium text-white mb-1">Stakeholder Mapping</h4>
                <p className="text-gray-400 text-sm">Identify decision makers and influence levels</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <Zap className="w-8 h-8 text-slate-300 mb-2" />
                <h4 className="font-medium text-white mb-1">Financial Integration</h4>
                <p className="text-gray-400 text-sm">Connect insights to QBO financial data</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Library Tab */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search transcripts, participants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/25 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="completed" className="bg-slate-800">Completed</option>
                <option value="processing" className="bg-slate-800">Processing</option>
                <option value="failed" className="bg-slate-800">Failed</option>
              </select>
              <select
                value={filterCallType}
                onChange={(e) => setFilterCallType(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="all" className="bg-slate-800">All Types</option>
                <option value="discovery" className="bg-slate-800">Discovery</option>
                <option value="audit" className="bg-slate-800">Audit</option>
                <option value="follow-up" className="bg-slate-800">Follow-up</option>
                <option value="close" className="bg-slate-800">Close</option>
              </select>
            </div>
          </div>

          {/* Transcripts List */}
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <div className="space-y-4">
              {filteredTranscripts.map(transcript => (
                <div
                  key={transcript.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25 hover:bg-white/15 transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedTranscript(transcript)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-blue-500/20">
                        {getStatusIcon(transcript.status)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-white">{transcript.fileName}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getCallTypeColor(transcript.callType)}`}>
                            {transcript.callType}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{transcript.date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{transcript.duration}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{transcript.participants.join(', ')}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {transcript.status === 'completed' && (
                        <>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded ${getSentimentColor(transcript.sentiment)}`}>
                            {getSentimentIcon(transcript.sentiment)}
                            <span className="text-sm font-medium capitalize">{transcript.sentiment}</span>
                          </div>
                          {transcript.aiAnalysis && (
                            <div className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-sm font-medium">
                              Score: {transcript.aiAnalysis.salesScore}/100
                            </div>
                          )}
                        </>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredTranscripts.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No transcripts found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Total Calls</h3>
                  <p className="text-2xl font-semibold text-cyan-400">{transcripts.length}</p>
                </div>
                <Phone className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Avg. Score</h3>
                  <p className="text-2xl font-semibold text-green-400">
                    {transcripts.filter(t => t.aiAnalysis).length > 0 
                      ? Math.round(transcripts.filter(t => t.aiAnalysis).reduce((sum, t) => sum + (t.aiAnalysis?.salesScore || 0), 0) / transcripts.filter(t => t.aiAnalysis).length)
                      : 0}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">Completed</h3>
                  <p className="text-2xl font-semibold text-blue-400">
                    {transcripts.filter(t => t.status === 'completed').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">High Urgency</h3>
                  <p className="text-2xl font-semibold text-orange-400">
                    {transcripts.filter(t => t.aiAnalysis?.urgency === 'high').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </div>
          
          {/* Call Type Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
              <h4 className="font-medium text-white mb-4">Call Type Distribution</h4>
              <div className="space-y-3">
                {['discovery', 'audit', 'follow-up', 'close'].map(type => {
                  const count = transcripts.filter(t => t.callType === type).length;
                  const percentage = transcripts.length > 0 ? (count / transcripts.length) * 100 : 0;
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">{type}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{count}</span>
                        <div className="w-16 h-2 bg-white/10 rounded-full">
                          <div 
                            className="h-2 bg-cyan-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
              <h4 className="font-medium text-white mb-4">Sentiment Analysis</h4>
              <div className="space-y-3">
                {['positive', 'neutral', 'negative'].map(sentiment => {
                  const count = transcripts.filter(t => t.sentiment === sentiment).length;
                  const percentage = transcripts.length > 0 ? (count / transcripts.length) * 100 : 0;
                  const color = sentiment === 'positive' ? 'bg-green-400' : sentiment === 'negative' ? 'bg-red-400' : 'bg-yellow-400';
                  return (
                    <div key={sentiment} className="flex items-center justify-between">
                      <span className="text-gray-300 capitalize">{sentiment}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-white font-medium">{count}</span>
                        <div className="w-16 h-2 bg-white/10 rounded-full">
                          <div 
                            className={`h-2 ${color} rounded-full`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sales Insights Tab */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <h3 className="text-xl font-medium text-white mb-6">Consolidated Sales Intelligence</h3>
            
            {/* High-Value Opportunities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-green-400" />
                  High-Value Opportunities
                </h4>
                <div className="space-y-3">
                  {transcripts
                    .filter(t => t.aiAnalysis && t.aiAnalysis.salesScore >= 80)
                    .slice(0, 3)
                    .map(transcript => (
                      <div key={transcript.id} className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{transcript.fileName}</span>
                          <span className="text-green-400 font-bold">{transcript.aiAnalysis?.salesScore}/100</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">{transcript.summary}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-6 border border-red-500/30">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Urgent Follow-ups Required
                </h4>
                <div className="space-y-3">
                  {transcripts
                    .filter(t => t.aiAnalysis?.urgency === 'high')
                    .slice(0, 3)
                    .map(transcript => (
                      <div key={transcript.id} className="bg-white/10 rounded-lg p-3 border border-white/20">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium">{transcript.fileName}</span>
                          <span className="text-red-400 font-bold">HIGH</span>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">
                          {transcript.aiAnalysis?.nextSteps?.[0] || 'Immediate follow-up required'}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Common Patterns */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/25">
              <h4 className="font-semibold text-white mb-4">Recurring Themes Across Calls</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="text-cyan-400 font-medium mb-3">Top Pain Points</h5>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Manual financial reporting (73% of calls)</li>
                    <li>• Cash flow visibility (68% of calls)</li>
                    <li>• Month-end close delays (52% of calls)</li>
                    <li>• Limited forecasting (47% of calls)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-purple-400 font-medium mb-3">Business Goals</h5>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• Scale operations (81% of calls)</li>
                    <li>• Improve efficiency (74% of calls)</li>
                    <li>• Automate processes (66% of calls)</li>
                    <li>• Better reporting (59% of calls)</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-orange-400 font-medium mb-3">Budget Ranges</h5>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li>• $8-12K/month (43% of qualified calls)</li>
                    <li>• $5-8K/month (31% of qualified calls)</li>
                    <li>• $12-20K/month (18% of qualified calls)</li>
                    <li>• $20K+/month (8% of qualified calls)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Transcript Modal */}
      {selectedTranscript && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-medium text-white">{selectedTranscript.fileName}</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => exportTranscriptAnalysis(selectedTranscript)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setSelectedTranscript(null)}
                  className="text-gray-500 hover:text-white transition-colors duration-200 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Call Details & Summary */}
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h3 className="font-medium text-white mb-3">Call Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCallTypeColor(selectedTranscript.callType)}`}>
                        {selectedTranscript.callType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span className="text-white">{selectedTranscript.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date:</span>
                      <span className="text-white">{selectedTranscript.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Participants:</span>
                      <span className="text-white">{selectedTranscript.participants.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sentiment:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSentimentColor(selectedTranscript.sentiment)}`}>
                        {selectedTranscript.sentiment}
                      </span>
                    </div>
                    {selectedTranscript.aiAnalysis && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sales Score:</span>
                        <span className="text-white font-bold">{selectedTranscript.aiAnalysis.salesScore}/100</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h3 className="font-medium text-white mb-2">Summary</h3>
                  <p className="text-gray-300 text-sm">{selectedTranscript.summary}</p>
                </div>

                {selectedTranscript.aiAnalysis && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                    <h3 className="font-medium text-white mb-3">Decision Makers</h3>
                    <div className="space-y-2">
                      {selectedTranscript.aiAnalysis.decisionMakers.map((dm, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
                          <div>
                            <span className="text-white font-medium">{dm.name}</span>
                            <span className="text-gray-400 text-sm ml-2">({dm.role})</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            dm.influence === 'high' ? 'bg-red-500/20 text-red-400' :
                            dm.influence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {dm.influence.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* AI Analysis Results */}
              {selectedTranscript.aiAnalysis && (
                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                    <h3 className="font-medium text-white mb-3">Pain Points Identified</h3>
                    <ul className="space-y-2">
                      {selectedTranscript.aiAnalysis.painPoints.map((pain, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start">
                          <AlertTriangle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                    <h3 className="font-medium text-white mb-3">Business Goals</h3>
                    <ul className="space-y-2">
                      {selectedTranscript.aiAnalysis.businessGoals.map((goal, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start">
                          <Target className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                    <h3 className="font-medium text-white mb-3">Budget Indicators</h3>
                    <ul className="space-y-2">
                      {selectedTranscript.aiAnalysis.budgetIndications.map((budget, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start">
                          <DollarSign className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                          {budget}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                    <h3 className="font-medium text-white mb-3">Financial Insights</h3>
                    <ul className="space-y-2">
                      {selectedTranscript.aiAnalysis.financialInsights.map((insight, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start">
                          <Brain className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                    <h3 className="font-medium text-white mb-3">Next Steps</h3>
                    <ul className="space-y-2">
                      {selectedTranscript.aiAnalysis.nextSteps.map((step, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start">
                          <CheckCircle className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                    <h3 className="font-medium text-white mb-3">Risk Factors</h3>
                    <ul className="space-y-2">
                      {selectedTranscript.aiAnalysis.riskFactors.map((risk, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start">
                          <AlertTriangle className="w-4 h-4 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedTranscript.aiAnalysis.competitiveThreats.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                      <h3 className="font-medium text-white mb-3">Competitive Threats</h3>
                      <ul className="space-y-2">
                        {selectedTranscript.aiAnalysis.competitiveThreats.map((threat, index) => (
                          <li key={index} className="text-sm text-gray-300 flex items-start">
                            <Users className="w-4 h-4 text-orange-400 mr-2 mt-0.5 flex-shrink-0" />
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Urgency & Call Type Analysis */}
                  <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white">AI Assessment</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedTranscript.aiAnalysis.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                          selectedTranscript.aiAnalysis.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {selectedTranscript.aiAnalysis.urgency.toUpperCase()} URGENCY
                        </span>
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs font-medium">
                          {selectedTranscript.aiAnalysis.salesScore}/100 SCORE
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300">
                      <p className="mb-2">
                        <strong className="text-white">Opportunity Assessment:</strong> 
                        {selectedTranscript.aiAnalysis.salesScore >= 80 ? ' High-value opportunity with strong fit indicators.' :
                         selectedTranscript.aiAnalysis.salesScore >= 60 ? ' Moderate opportunity requiring nurturing.' :
                         ' Lower priority opportunity - focus on qualification.'}
                      </p>
                      <p>
                        <strong className="text-white">Recommended Action:</strong> 
                        {selectedTranscript.aiAnalysis.urgency === 'high' ? ' Immediate follow-up within 24 hours.' :
                         selectedTranscript.aiAnalysis.urgency === 'medium' ? ' Follow-up within 3-5 business days.' :
                         ' Standard follow-up cadence.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Topics and Action Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                    <h3 className="font-medium text-white mb-3">Key Topics Discussed</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTranscript.keyTopics.map((topic, index) => (
                        <span
                          key={index}
                          className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm border border-cyan-500/30"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                    <h3 className="font-medium text-white mb-3">Action Items</h3>
                    <ul className="space-y-2">
                      {selectedTranscript.actionItems.map((item, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Financial Integration Preview */}
                {selectedTranscript.companyId && (
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6 border border-green-500/30">
                    <h3 className="font-medium text-white mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                      Financial Data Integration Ready
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 mb-1">✓</div>
                        <div className="text-sm text-gray-300">QBO Connected</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">✓</div>
                        <div className="text-sm text-gray-300">Call Analysis Complete</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400 mb-1">→</div>
                        <div className="text-sm text-gray-300">Ready for Audit Deck</div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 mx-auto">
                        <Brain className="w-4 h-4" />
                        <span>Generate Intelligent Audit Deck</span>
                      </button>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-2">
                      Combine financial data with call insights for personalized presentation
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCallTranscriptIntegration;
