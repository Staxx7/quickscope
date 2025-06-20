'use client';
import React, { useState, useEffect } from 'react';
import { 
  Mic, Users, Target, AlertTriangle, TrendingUp, Clock, 
  ChevronDown, ChevronUp, CheckCircle, XCircle, AlertCircle,
  Briefcase, Brain, Phone, Calendar, DollarSign, MessageSquare,
  UserCheck, FileText, BarChart3, Shield, Zap, Star
} from 'lucide-react';

interface DecisionMaker {
  name: string;
  role: string;
  influence: 'high' | 'medium' | 'low';
  concerns: string[];
  priorities: string[];
}

interface PainPoint {
  category: 'operational' | 'financial' | 'strategic' | 'technology';
  description: string;
  urgency: 'high' | 'medium' | 'low';
  impact: string;
  evidence?: string;
}

interface Opportunity {
  type: string;
  description: string;
  value: string;
  timeline: string;
  requirements: string[];
}

interface CallTranscriptAnalysis {
  id: string;
  prospect_id: string;
  company_name: string;
  created_at: string;
  transcript_text: string;
  closeability_score: number;
  urgency_level: 'high' | 'medium' | 'low';
  readiness_level?: 'not-ready' | 'exploring' | 'evaluating' | 'ready';
  analysis_data: {
    painPoints?: {
      operational?: string[];
      financial?: string[];
      strategic?: string[];
      technology?: string[];
    };
    businessObjectives?: {
      shortTerm?: string[];
      longTerm?: string[];
      growthTargets?: string[];
      efficiencyGoals?: string[];
    };
    decisionMakers?: Array<{
      name?: string;
      role?: string;
      influence?: string;
      concerns?: string[];
      priorities?: string[];
    }>;
    urgencySignals?: {
      timeline?: string;
      pressurePoints?: string[];
      catalysts?: string[];
      budget?: string;
    };
    competitiveContext?: {
      alternatives?: string[];
      differentiators?: string[];
      threats?: string[];
    };
    salesIntelligence?: {
      buyingSignals?: string[];
      objections?: string[];
      nextSteps?: string[];
      closeability?: number;
    };
  };
  talking_points?: {
    openingStatements?: string[];
    problemAmplification?: string[];
    solutionTransitions?: string[];
    valuePropositions?: string[];
    objectionResponses?: string[];
    closingStatements?: string[];
  };
}

interface EnhancedCallTranscriptAnalysisProps {
  prospectId: string;
  companyName: string;
  onAnalysisComplete?: (analysis: CallTranscriptAnalysis) => void;
}

export default function EnhancedCallTranscriptAnalysis({ 
  prospectId, 
  companyName,
  onAnalysisComplete 
}: EnhancedCallTranscriptAnalysisProps) {
  const [analysis, setAnalysis] = useState<CallTranscriptAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview', 'decision-makers']));

  useEffect(() => {
    fetchTranscriptAnalysis();
  }, [prospectId]);

  const fetchTranscriptAnalysis = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai/process-transcript?prospectId=${prospectId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch transcript analysis');
      }

      const data = await response.json();
      
      if (data.analyses && data.analyses.length > 0) {
        const latestAnalysis = data.analyses[0];
        setAnalysis(latestAnalysis);
        onAnalysisComplete?.(latestAnalysis);
      } else {
        setError('No transcript analysis found for this prospect');
      }
    } catch (err) {
      console.error('Error fetching transcript analysis:', err);
      setError('Failed to load transcript analysis');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getReadinessIcon = (readiness?: string) => {
    switch (readiness) {
      case 'ready': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'evaluating': return <BarChart3 className="w-5 h-5 text-yellow-400" />;
      case 'exploring': return <Brain className="w-5 h-5 text-blue-400" />;
      default: return <XCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/3"></div>
          <div className="h-4 bg-white/10 rounded w-2/3"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Transcript Analysis Available</h3>
          <p className="text-gray-400">{error || 'Upload a call transcript to see AI-powered analysis'}</p>
        </div>
      </div>
    );
  }

  const painPoints = analysis.analysis_data.painPoints || {};
  const objectives = analysis.analysis_data.businessObjectives || {};
  const decisionMakers = analysis.analysis_data.decisionMakers || [];
  const urgencySignals = analysis.analysis_data.urgencySignals || {};
  const competitive = analysis.analysis_data.competitiveContext || {};
  const salesIntel = analysis.analysis_data.salesIntelligence || {};
  const talkingPoints = analysis.talking_points || {};

  return (
    <div className="space-y-6">
      {/* Overview Section */}
      <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
        <button
          onClick={() => toggleSection('overview')}
          className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <Mic className="w-6 h-6 text-purple-400" />
            </div>
            <div className="text-left">
              <h2 className="text-2xl font-bold text-white">Call Transcript Analysis</h2>
              <p className="text-gray-400 mt-1">AI-powered insights from discovery call</p>
            </div>
          </div>
          {expandedSections.has('overview') ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </button>

        {expandedSections.has('overview') && (
          <div className="px-6 pb-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-2">Closeability Score</div>
                <div className={`text-4xl font-bold ${getScoreColor(analysis.closeability_score)}`}>
                  {analysis.closeability_score}%
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  {analysis.closeability_score >= 80 ? 'High probability' : 
                   analysis.closeability_score >= 60 ? 'Good opportunity' :
                   analysis.closeability_score >= 40 ? 'Needs nurturing' : 'Early stage'}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-2">Urgency Level</div>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(analysis.urgency_level)}`}>
                  <Clock className="w-4 h-4" />
                  {analysis.urgency_level.charAt(0).toUpperCase() + analysis.urgency_level.slice(1)}
                </div>
                <div className="text-gray-500 text-xs mt-2">
                  {urgencySignals.timeline || 'Timeline not specified'}
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-2">Readiness Level</div>
                <div className="flex items-center gap-2">
                  {getReadinessIcon(analysis.readiness_level)}
                  <span className="text-white font-medium">
                    {analysis.readiness_level ? 
                      analysis.readiness_level.charAt(0).toUpperCase() + analysis.readiness_level.slice(1).replace('-', ' ') : 
                      'Not assessed'}
                  </span>
                </div>
                <div className="text-gray-500 text-xs mt-2">
                  {decisionMakers.length} decision maker{decisionMakers.length !== 1 ? 's' : ''} identified
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-gray-400 text-sm mb-2">Call Date</div>
                <div className="text-white font-medium">
                  {new Date(analysis.created_at).toLocaleDateString()}
                </div>
                <div className="text-gray-500 text-xs mt-2">
                  {salesIntel.buyingSignals?.length || 0} buying signals
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            {salesIntel.buyingSignals && salesIntel.buyingSignals.length > 0 && (
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                <h4 className="text-green-400 font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Key Buying Signals Detected
                </h4>
                <ul className="space-y-1">
                  {salesIntel.buyingSignals.slice(0, 3).map((signal, idx) => (
                    <li key={idx} className="text-green-300 text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decision Makers Section */}
      <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
        <button
          onClick={() => toggleSection('decision-makers')}
          className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">Decision Makers & Stakeholders</h3>
              <p className="text-gray-400 text-sm">{decisionMakers.length} key contact{decisionMakers.length !== 1 ? 's' : ''} identified</p>
            </div>
          </div>
          {expandedSections.has('decision-makers') ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </button>

        {expandedSections.has('decision-makers') && (
          <div className="px-6 pb-6">
            {decisionMakers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {decisionMakers.map((dm, idx) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium text-lg">
                          {dm.name || `Stakeholder ${idx + 1}`}
                        </h4>
                        <p className="text-gray-400 text-sm">{dm.role || 'Role not specified'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        dm.influence === 'high' ? 'bg-red-500/20 text-red-400' :
                        dm.influence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {dm.influence || 'Unknown'} influence
                      </span>
                    </div>

                    {dm.concerns && dm.concerns.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-gray-300 text-sm font-medium mb-1">Key Concerns:</h5>
                        <ul className="space-y-1">
                          {dm.concerns.map((concern, cidx) => (
                            <li key={cidx} className="text-gray-400 text-sm flex items-start gap-2">
                              <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-orange-400" />
                              <span>{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {dm.priorities && dm.priorities.length > 0 && (
                      <div>
                        <h5 className="text-gray-300 text-sm font-medium mb-1">Priorities:</h5>
                        <ul className="space-y-1">
                          {dm.priorities.map((priority, pidx) => (
                            <li key={pidx} className="text-gray-400 text-sm flex items-start gap-2">
                              <Target className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-400" />
                              <span>{priority}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <UserCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No decision makers identified in the transcript</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pain Points Section */}
      <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
        <button
          onClick={() => toggleSection('pain-points')}
          className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">Identified Pain Points</h3>
              <p className="text-gray-400 text-sm">Current challenges and struggles</p>
            </div>
          </div>
          {expandedSections.has('pain-points') ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </button>

        {expandedSections.has('pain-points') && (
          <div className="px-6 pb-6 space-y-4">
            {Object.entries(painPoints).map(([category, points]) => (
              points && points.length > 0 && (
                <div key={category} className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    {category === 'operational' && <Zap className="w-4 h-4 text-yellow-400" />}
                    {category === 'financial' && <DollarSign className="w-4 h-4 text-green-400" />}
                    {category === 'strategic' && <Target className="w-4 h-4 text-blue-400" />}
                    {category === 'technology' && <Shield className="w-4 h-4 text-purple-400" />}
                    {category.charAt(0).toUpperCase() + category.slice(1)} Pain Points
                  </h4>
                  <ul className="space-y-2">
                    {points.map((point, idx) => (
                      <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* Business Objectives Section */}
      <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
        <button
          onClick={() => toggleSection('objectives')}
          className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">Business Objectives & Goals</h3>
              <p className="text-gray-400 text-sm">What they want to achieve</p>
            </div>
          </div>
          {expandedSections.has('objectives') ? 
            <ChevronUp className="w-5 h-5 text-gray-400" /> : 
            <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </button>

        {expandedSections.has('objectives') && (
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {objectives.shortTerm && objectives.shortTerm.length > 0 && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  Short-term Goals
                </h4>
                <ul className="space-y-2">
                  {objectives.shortTerm.map((goal, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-400" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {objectives.longTerm && objectives.longTerm.length > 0 && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  Long-term Vision
                </h4>
                <ul className="space-y-2">
                  {objectives.longTerm.map((goal, idx) => (
                    <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                      <Star className="w-4 h-4 mt-0.5 flex-shrink-0 text-yellow-400" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Talking Points Section */}
      {talkingPoints && Object.keys(talkingPoints).length > 0 && (
        <div className="bg-white/8 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden">
          <button
            onClick={() => toggleSection('talking-points')}
            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                <MessageSquare className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-white">Recommended Talking Points</h3>
                <p className="text-gray-400 text-sm">AI-generated conversation guides</p>
              </div>
            </div>
            {expandedSections.has('talking-points') ? 
              <ChevronUp className="w-5 h-5 text-gray-400" /> : 
              <ChevronDown className="w-5 h-5 text-gray-400" />
            }
          </button>

          {expandedSections.has('talking-points') && (
            <div className="px-6 pb-6 space-y-4">
              {talkingPoints.openingStatements && talkingPoints.openingStatements.length > 0 && (
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
                  <h4 className="text-cyan-400 font-medium mb-3">🎯 Opening Statements</h4>
                  <ul className="space-y-2">
                    {talkingPoints.openingStatements.map((statement, idx) => (
                      <li key={idx} className="text-cyan-200 text-sm italic">
                        "{statement}"
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {talkingPoints.valuePropositions && talkingPoints.valuePropositions.length > 0 && (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                  <h4 className="text-green-400 font-medium mb-3">💎 Value Propositions</h4>
                  <ul className="space-y-2">
                    {talkingPoints.valuePropositions.map((prop, idx) => (
                      <li key={idx} className="text-green-200 text-sm">
                        • {prop}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {talkingPoints.objectionResponses && talkingPoints.objectionResponses.length > 0 && (
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-4 border border-yellow-500/20">
                  <h4 className="text-yellow-400 font-medium mb-3">🛡️ Objection Handling</h4>
                  <ul className="space-y-2">
                    {talkingPoints.objectionResponses.map((response, idx) => (
                      <li key={idx} className="text-yellow-200 text-sm">
                        • {response}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sales Intelligence Summary */}
      <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-3xl border border-purple-500/20 p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-400" />
          Sales Intelligence Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-gray-300 text-sm font-medium mb-2">Next Best Actions</h4>
            {salesIntel.nextSteps && salesIntel.nextSteps.length > 0 ? (
              <ul className="space-y-1">
                {salesIntel.nextSteps.slice(0, 3).map((step, idx) => (
                  <li key={idx} className="text-white text-sm">
                    {idx + 1}. {step}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No specific next steps identified</p>
            )}
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-gray-300 text-sm font-medium mb-2">Key Objections</h4>
            {salesIntel.objections && salesIntel.objections.length > 0 ? (
              <ul className="space-y-1">
                {salesIntel.objections.map((objection, idx) => (
                  <li key={idx} className="text-orange-300 text-sm flex items-start gap-2">
                    <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{objection}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-400 text-sm">No major objections detected</p>
            )}
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-gray-300 text-sm font-medium mb-2">Competitive Context</h4>
            {competitive.alternatives && competitive.alternatives.length > 0 ? (
              <div>
                <p className="text-yellow-300 text-sm mb-1">Considering alternatives:</p>
                <ul className="space-y-1">
                  {competitive.alternatives.map((alt, idx) => (
                    <li key={idx} className="text-gray-400 text-sm">• {alt}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-green-400 text-sm">No competitors mentioned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 