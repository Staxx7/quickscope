'use client';
import React, { useState, useRef } from 'react';
import { Upload, FileText, Play, Pause, Download, MessageSquare, Brain, Clock, User, Phone, Calendar, Search, Filter, ChevronDown, ChevronRight, Star, AlertCircle, CheckCircle, TrendingUp, Zap, Eye, BarChart3 } from 'lucide-react';

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
}

const CallTranscriptsIntegration: React.FC = () => {
  const [transcripts, setTranscripts] = useState<CallTranscript[]>([]);
  const [selectedTranscript, setSelectedTranscript] = useState<CallTranscript | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const newTranscript: CallTranscript = {
        id: `transcript_${Date.now()}_${i}`,
        fileName: file.name,
        duration: '00:00',
        date: new Date().toISOString().split('T')[0],
        participants: ['John Doe', 'Jane Smith'],
        status: 'processing',
        sentiment: 'neutral',
        keyTopics: [],
        actionItems: [],
        summary: '',
        confidence: 0
      };
      
      setTranscripts(prev => [...prev, newTranscript]);
      
      setTimeout(() => {
        setTranscripts(prev => prev.map(t => 
          t.id === newTranscript.id 
            ? {
                ...t,
                status: 'completed',
                duration: '25:30',
                sentiment: Math.random() > 0.5 ? 'positive' : 'neutral',
                keyTopics: ['Product Demo', 'Pricing Discussion', 'Next Steps'],
                actionItems: ['Send proposal', 'Schedule follow-up', 'Share technical specs'],
                summary: 'Productive sales call discussing enterprise pricing and implementation timeline.',
                confidence: Math.floor(Math.random() * 20) + 80
              }
            : t
        ));
      }, 3000 + i * 1000);
    }
    setIsUploading(false);
  };

  const filteredTranscripts = transcripts.filter(transcript => {
    const matchesSearch = transcript.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transcript.participants.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || transcript.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4" />;
      case 'negative': return <AlertCircle className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-800 to-slate-900 p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium text-white mb-2">Call Transcripts AI</h1>
            <p className="text-gray-300">Upload, analyze, and extract insights from your sales calls</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/25">
              <Phone className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="text-right">
              <div className="text-white font-semibold">{transcripts.length}</div>
              <div className="text-gray-400 text-sm">Total Calls</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 mb-6">
        <div className="flex space-x-1 p-2">
          {[
            { id: 'upload', label: 'Upload & Process', icon: Upload },
            { id: 'library', label: 'Call Library', icon: FileText },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-200 ${
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
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/25 mb-6">
              <div className="bg-cyan-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Upload className="w-12 h-12 text-cyan-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-2">Upload Call Recordings</h3>
              <p className="text-gray-400 mb-6">Drag and drop your audio files or click to browse</p>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".mp3,.wav,.m4a,.mp4"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50"
              >
                {isUploading ? 'Processing...' : 'Choose Files'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <Brain className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="font-medium text-white mb-1">AI Transcription</h4>
                <p className="text-gray-400 text-sm">Automatic speech-to-text with 95%+ accuracy</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <MessageSquare className="w-8 h-8 text-cyan-400 mb-2" />
                <h4 className="font-medium text-white mb-1">Sentiment Analysis</h4>
                <p className="text-gray-400 text-sm">Understand customer emotions and reactions</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                <Zap className="w-8 h-8 text-slate-300 mb-2" />
                <h4 className="font-medium text-white mb-1">Action Items</h4>
                <p className="text-gray-400 text-sm">Extract key follow-ups and next steps</p>
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
                      <div className={`p-2 rounded-lg ${
                        transcript.status === 'completed' ? 'bg-green-500/20' :
                        transcript.status === 'processing' ? 'bg-yellow-500/20' :
                        'bg-red-500/20'
                      }`}>
                        {transcript.status === 'completed' ? <CheckCircle className="w-5 h-5 text-green-400" /> :
                         transcript.status === 'processing' ? <Clock className="w-5 h-5 text-yellow-400" /> :
                         <AlertCircle className="w-5 h-5 text-red-400" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{transcript.fileName}</h3>
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
                        <div className={`flex items-center space-x-1 ${getSentimentColor(transcript.sentiment)}`}>
                          {getSentimentIcon(transcript.sentiment)}
                          <span className="text-sm font-medium capitalize">{transcript.sentiment}</span>
                        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                  <h3 className="text-lg font-medium text-white">Avg. Sentiment</h3>
                  <p className="text-2xl font-semibold text-green-400">Positive</p>
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
          </div>
          
          <div className="text-center py-8">
            <BarChart3 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-400">Advanced call analytics and insights will be available here</p>
          </div>
        </div>
      )}

      {/* Selected Transcript Modal */}
      {selectedTranscript && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/8 backdrop-blur-xl rounded-2xl border border-white/20 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-medium text-white">{selectedTranscript.fileName}</h2>
              <button
                onClick={() => setSelectedTranscript(null)}
                className="text-gray-500 hover:text-white transition-colors duration-200"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h3 className="font-medium text-white mb-2">Call Details</h3>
                  <div className="space-y-2 text-sm">
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
                      <span className={`capitalize ${getSentimentColor(selectedTranscript.sentiment)}`}>
                        {selectedTranscript.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h3 className="font-medium text-white mb-2">Summary</h3>
                  <p className="text-gray-300 text-sm">{selectedTranscript.summary}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h3 className="font-medium text-white mb-2">Key Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTranscript.keyTopics.map((topic, index) => (
                      <span
                        key={index}
                        className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-sm"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/25">
                  <h3 className="font-medium text-white mb-2">Action Items</h3>
                  <ul className="space-y-2">
                    {selectedTranscript.actionItems.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallTranscriptsIntegration;
