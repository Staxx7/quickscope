'use client'
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Upload, FileText, Play, Pause, Trash2, Download, Eye, X,
  MessageSquare, Calendar, Clock, User, Building2, CheckCircle,
  AlertTriangle, RefreshCw, Zap, BarChart3, Target, ArrowLeft,
  Mic, Video, FileAudio, FileVideo, Plus, Search, Filter
} from 'lucide-react';
import { useToast } from '../../../components/Toast';

interface CallTranscript {
  id: string;
  accountId: string;
  accountName: string;
  fileName: string;
  fileType: 'audio' | 'video' | 'text';
  fileSize: string;
  uploadDate: string;
  callDate: string;
  duration: string;
  participants: string[];
  status: 'processing' | 'completed' | 'failed';
  transcriptionStatus: 'pending' | 'processing' | 'completed' | 'failed';
  insights: {
    sentiment: 'positive' | 'neutral' | 'negative';
    keyTopics: string[];
    actionItems: string[];
    financialMentions: string[];
  };
}

interface ConnectedAccount {
  id: string;
  companyName: string;
  primaryContact: string;
  industry: string;
  transcriptCount: number;
}

const CallTranscriptsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountParam = searchParams?.get('account');

  const [selectedAccount, setSelectedAccount] = useState<string>(accountParam || 'all');
  const [transcripts, setTranscripts] = useState<CallTranscript[]>([]);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(0);
const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    loadAccountsAndTranscripts();
  }, []);

  useEffect(() => {
    if (accountParam && accounts.length > 0) {
      setSelectedAccount(accountParam);
    }
  }, [accountParam, accounts]);

  // Auto-redirect countdown for Option A
  useEffect(() => {
    if (redirectCountdown > 0) {
      const timer = setTimeout(() => {
        if (redirectCountdown === 1) {
          // Redirect to main dashboard
          router.push('/admin/dashboard/main');
        } else {
          setRedirectCountdown(redirectCountdown - 1);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [redirectCountdown, router]);

  const loadAccountsAndTranscripts = async () => {
    // Mock data - replace with actual API calls
    const mockAccounts: ConnectedAccount[] = [
      {
        id: '1',
        companyName: 'TechCorp Solutions',
        primaryContact: 'Sarah Johnson, CFO',
        industry: 'Technology',
        transcriptCount: 0
      },
      {
        id: '2',
        companyName: 'Global Manufacturing Inc',
        primaryContact: 'Michael Chen, Controller',
        industry: 'Manufacturing',
        transcriptCount: 3
      },
      {
        id: '3',
        companyName: 'Healthcare Plus',
        primaryContact: 'Emily Rodriguez, CFO',
        industry: 'Healthcare',
        transcriptCount: 5
      }
    ];

    const mockTranscripts: CallTranscript[] = [
      {
        id: '1',
        accountId: '2',
        accountName: 'Global Manufacturing Inc',
        fileName: 'discovery_call_2024_06_01.mp3',
        fileType: 'audio',
        fileSize: '45.2 MB',
        uploadDate: '2024-06-01T10:30:00Z',
        callDate: '2024-06-01T09:00:00Z',
        duration: '47:23',
        participants: ['Michael Chen', 'John Smith', 'Lisa Davis'],
        status: 'completed',
        transcriptionStatus: 'completed',
        insights: {
          sentiment: 'positive',
          keyTopics: ['Financial Planning', 'Cash Flow', 'Growth Strategy'],
          actionItems: ['Review Q2 projections', 'Schedule follow-up', 'Prepare audit materials'],
          financialMentions: ['$5.2M revenue', 'Q2 growth 15%', 'Operating margin']
        }
      },
      {
        id: '2',
        accountId: '3',
        accountName: 'Healthcare Plus',
        fileName: 'quarterly_review_2024_05_28.mp4',
        fileType: 'video',
        fileSize: '120.8 MB',
        uploadDate: '2024-05-28T14:15:00Z',
        callDate: '2024-05-28T13:00:00Z',
        duration: '1:12:45',
        participants: ['Emily Rodriguez', 'Mark Wilson', 'Sarah Brown'],
        status: 'completed',
        transcriptionStatus: 'completed',
        insights: {
          sentiment: 'neutral',
          keyTopics: ['Compliance', 'Risk Assessment', 'Financial Controls'],
          actionItems: ['Update compliance procedures', 'Review internal controls', 'Audit preparation'],
          financialMentions: ['$3.6M annual revenue', 'Compliance costs', 'Risk mitigation']
        }
      }
    ];

    setAccounts(mockAccounts);
    setTranscripts(mockTranscripts);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (selectedAccount === 'all') {
      alert('Please select a specific account before uploading transcripts');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate file upload with progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadProgress(i);
    }

    // Simulate processing
    const file = files[0];
    const newTranscript: CallTranscript = {
      id: `transcript-${Date.now()}`,
      accountId: selectedAccount,
      accountName: accounts.find(a => a.id === selectedAccount)?.companyName || 'Unknown',
      fileName: file.name,
      fileType: file.type.startsWith('audio/') ? 'audio' : file.type.startsWith('video/') ? 'video' : 'text',
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      uploadDate: new Date().toISOString(),
      callDate: new Date().toISOString(),
      duration: '0:00:00',
      participants: ['Unknown'],
      status: 'processing',
      transcriptionStatus: 'processing',
      insights: {
        sentiment: 'neutral',
        keyTopics: [],
        actionItems: [],
        financialMentions: []
      }
    };

    setTranscripts(prev => [newTranscript, ...prev]);
    setIsUploading(false);
    setUploadProgress(0);

    // Update account transcript count
    setAccounts(prev => prev.map(account => 
      account.id === selectedAccount 
        ? { ...account, transcriptCount: account.transcriptCount + 1 }
        : account
    ));

    // **OPTION A: SUCCESS TOAST + AUTO-REDIRECT**
showToast('Transcripts uploaded successfully!', 'success', 3);
setRedirectCountdown(3);

// Update localStorage to trigger main dashboard refresh
if (typeof window !== 'undefined') {
  localStorage.setItem(`account-${selectedAccount}-transcripts`, 'uploaded');
  localStorage.setItem(`account-${selectedAccount}-upload-time`, new Date().toISOString());
  localStorage.setItem('last-upload-account', selectedAccount);
}

    // Simulate API call to update account status in backend
    // This would update the account's transcriptsUploaded status to true
    try {
      // await updateAccountStatus(selectedAccount, { transcriptsUploaded: true });
      console.log(`Updated account ${selectedAccount} transcript status to uploaded`);
    } catch (error) {
      console.error('Failed to update account status:', error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'audio': return <FileAudio className="w-6 h-6 text-green-400" />;
      case 'video': return <FileVideo className="w-6 h-6 text-blue-400" />;
      default: return <FileText className="w-6 h-6 text-gray-400" />;
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400 bg-green-500/20';
      case 'negative': return 'text-red-400 bg-red-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-500/20';
      case 'processing': return 'text-blue-400 bg-blue-500/20';
      case 'failed': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredTranscripts = transcripts.filter(transcript => {
    const matchesAccount = selectedAccount === 'all' || transcript.accountId === selectedAccount;
    const matchesSearch = transcript.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transcript.accountName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || transcript.status === filterStatus;
    return matchesAccount && matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      
{/* Success Toast for Option A */}
{showSuccessToast && (
  <div className="fixed top-6 right-6 z-50 bg-green-500/20 border border-green-500/30 backdrop-blur-xl rounded-xl p-4 text-white">
    <div className="flex items-center space-x-3">
      <CheckCircle className="w-6 h-6 text-green-400" />
      <div>
        <h3 className="font-medium">Transcripts uploaded successfully!</h3>
        <p className="text-sm text-gray-300">
          Redirecting to dashboard in {redirectCountdown} seconds...
        </p>
      </div>
    </div>
  </div>
)}

      {/* Header */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">Call Transcript Management</h1>
            <p className="text-gray-300">Upload and analyze client call transcripts for enhanced context</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.push('/admin/dashboard/main')}
              className="bg-white/10 backdrop-blur-sm border border-white/25 text-white px-4 py-2 rounded-xl hover:bg-white/15 transition-all duration-200 flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>
          </div>
        </div>
      </div>

      {/* Account Selection & Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Account Selection */}
        <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
          <h2 className="text-xl font-medium text-white mb-4">Select Account</h2>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/25 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          >
            <option value="all" className="bg-slate-800 text-white">All Accounts</option>
            {accounts.map(account => (
              <option key={account.id} value={account.id} className="bg-slate-800 text-white">
                {account.companyName}
              </option>
            ))}
          </select>
          
          {selectedAccount !== 'all' && (
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="font-medium text-white mb-2">
                {accounts.find(a => a.id === selectedAccount)?.companyName}
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                {accounts.find(a => a.id === selectedAccount)?.primaryContact}
              </p>
              <p className="text-xs text-gray-500">
                {accounts.find(a => a.id === selectedAccount)?.transcriptCount} transcripts uploaded
              </p>
            </div>
          )}
        </div>

        {/* File Upload */}
        <div className="lg:col-span-2">
          <div 
            className={`bg-white/8 backdrop-blur-xl rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
              dragActive 
                ? 'border-blue-400 bg-blue-500/10' 
                : 'border-white/20 hover:border-white/40'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {isUploading ? (
              <div className="space-y-4">
                <RefreshCw className="w-12 h-12 text-blue-400 animate-spin mx-auto" />
                <h3 className="text-lg font-medium text-white">Uploading Transcript...</h3>
                <div className="w-full bg-white/10 rounded-full h-2 max-w-md mx-auto">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-gray-400">{uploadProgress}% complete</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-medium text-white mb-2">Upload Call Transcript</h3>
                  <p className="text-gray-400 mb-4">
                    Drag and drop your audio, video, or text files here
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span>Supports: MP3, MP4, WAV, TXT, DOCX</span>
                    <span>•</span>
                    <span>Max size: 500MB</span>
                  </div>
                </div>
                <input
                  type="file"
                  multiple
                  accept=".mp3,.mp4,.wav,.txt,.docx,.pdf"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                  disabled={selectedAccount === 'all'}
                />
                <label
                  htmlFor="file-upload"
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                    selectedAccount === 'all'
                      ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span>Choose Files</span>
                </label>
                {selectedAccount === 'all' && (
                  <p className="text-yellow-400 text-sm">Please select a specific account first</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transcripts, accounts..."
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
        </div>
      </div>

      {/* Transcripts List */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-white">Uploaded Transcripts ({filteredTranscripts.length})</h2>
        </div>

        {filteredTranscripts.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No Transcripts Found</h3>
            <p className="text-gray-400">
              {selectedAccount === 'all' 
                ? 'Upload your first call transcript to get started'
                : 'No transcripts uploaded for this account yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTranscripts.map(transcript => (
              <div key={transcript.id} className="bg-white/5 rounded-xl p-6 hover:bg-white/8 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(transcript.fileType)}
                    <div>
                      <h3 className="font-medium text-white">{transcript.fileName}</h3>
                      <p className="text-sm text-gray-400">{transcript.accountName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transcript.status)}`}>
                      {transcript.status}
                    </span>
                    {transcript.transcriptionStatus === 'completed' && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(transcript.insights.sentiment)}`}>
                        {transcript.insights.sentiment}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-400">Duration</span>
                    <p className="text-white">{transcript.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">File Size</span>
                    <p className="text-white">{transcript.fileSize}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Call Date</span>
                    <p className="text-white">{new Date(transcript.callDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Participants</span>
                    <p className="text-white">{transcript.participants.length} people</p>
                  </div>
                </div>

                {transcript.transcriptionStatus === 'completed' && transcript.insights.keyTopics.length > 0 && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400 text-sm">Key Topics:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {transcript.insights.keyTopics.map(topic => (
                          <span key={topic} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {transcript.insights.actionItems.length > 0 && (
                      <div>
                        <span className="text-gray-400 text-sm">Action Items:</span>
                        <ul className="mt-1 space-y-1">
                          {transcript.insights.actionItems.slice(0, 3).map((item, index) => (
                            <li key={index} className="text-white text-sm flex items-center space-x-2">
                              <Target className="w-3 h-3 text-cyan-400" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                  <div className="text-sm text-gray-400">
                    Uploaded {new Date(transcript.uploadDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
  <button 
    onClick={() => {
      // Preview transcript functionality
      alert(`Preview transcript: ${transcript.fileName}\n\nThis would open a modal with transcript content and analysis.`);
    }}
    className="bg-white/10 border border-white/25 text-white p-2 rounded-lg hover:bg-white/15 transition-all duration-200"
    title="Preview Transcript"
  >
    <Eye className="w-4 h-4" />
  </button>
  <button 
    onClick={() => {
      // Download transcript functionality
      const element = document.createElement('a');
      const file = new Blob([`Transcript: ${transcript.fileName}\n\nGenerated insights and analysis would be downloaded here.`], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${transcript.fileName}_analysis.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }}
    className="bg-white/10 border border-white/25 text-white p-2 rounded-lg hover:bg-white/15 transition-all duration-200"
    title="Download Transcript"
  >
    <Download className="w-4 h-4" />
  </button>
  <button 
    onClick={() => {
      if (confirm(`Are you sure you want to delete ${transcript.fileName}?`)) {
        setTranscripts(prev => prev.filter(t => t.id !== transcript.id));
        // Update account transcript count
        setAccounts(prev => prev.map(account => 
          account.id === transcript.accountId 
            ? { ...account, transcriptCount: Math.max(0, account.transcriptCount - 1) }
            : account
        ));
      }
    }}
    className="bg-red-500/20 border border-red-500/30 text-red-400 p-2 rounded-lg hover:bg-red-500/30 transition-all duration-200"
    title="Delete Transcript"
  >
    <Trash2 className="w-4 h-4" />
  </button>
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CallTranscriptsPage;
