
import React, { useState } from 'react';
import { FailureScenario, UserRole } from '../types';
import { 
  Zap, ShieldAlert, ChevronDown, ChevronUp, Lock, 
  Target, Activity, HelpCircle, CheckCircle2, Shield,
  Clock, BarChart, Search, Eye, Sparkles, Loader2, Info
} from 'lucide-react';
import { explainFailureDeeply } from '../services/geminiService';

interface ScenarioCardProps {
  scenario: FailureScenario;
  role: UserRole;
  forceExpand?: boolean;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, forceExpand = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [deepBriefing, setDeepBriefing] = useState<string | null>(null);
  const isExpanded = showDetails || forceExpand;

  const handleDeepExplain = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deepBriefing) {
      setDeepBriefing(null);
      return;
    }
    
    setExplaining(true);
    setShowDetails(true);
    try {
      const briefing = await explainFailureDeeply(scenario, "Distributed Infrastructure & AI Microservices");
      setDeepBriefing(briefing);
    } catch (err) {
      console.error(err);
      alert("Briefing generation failed.");
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="bg-[#12162b] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl transition-all group/card">
      {/* Scenario Header */}
      <div className="p-10 flex flex-col md:flex-row justify-between gap-8 items-start">
        <div className="flex items-start gap-8 flex-1">
          <div className="p-5 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl border border-white/10">
            <Zap className="text-purple-400" size={32} />
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-white leading-tight italic">{scenario.title}</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-[10px] font-black text-[#f43f5e] uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Prob: {scenario.probability}% (P95)</span>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Blast: {scenario.blastRadius}</span>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">MTTR: {scenario.mttrMinutes}m</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-4">
           <div className="flex gap-3">
             <button 
                onClick={handleDeepExplain}
                disabled={explaining}
                className="flex items-center gap-2 px-5 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-purple-600/30 transition-all active:scale-95 disabled:opacity-50"
             >
                {explaining ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                {deepBriefing ? 'CLOSE BRIEFING' : 'EXPLAIN ERROR'}
             </button>
             <span className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black rounded-full uppercase tracking-widest">
                {scenario.severity}
             </span>
           </div>
        </div>
      </div>

      {/* Attributes Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-y border-white/5">
        <div className="p-8 border-r border-white/5 space-y-2">
           <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
             <Activity size={12}/> Detectability
           </div>
           <div className="text-xl font-black text-white italic">{scenario.detectability}</div>
        </div>
        <div className="p-8 border-r border-white/5 space-y-2">
           <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
             <Clock size={12}/> Est. Downtime
           </div>
           <div className="text-xl font-black text-white italic">{scenario.expectedDowntimeHours}h</div>
        </div>
        <div className="p-8 border-r border-white/5 space-y-2">
           <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
             <Target size={12}/> Revenue Impact
           </div>
           <div className="text-xl font-black text-white italic truncate">{scenario.revenueImpactRange}</div>
        </div>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="p-8 flex items-center justify-between hover:bg-white/5 transition-all text-left"
        >
           <div className="space-y-2">
              <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                <HelpCircle size={12}/> Forensic Path
              </div>
              <div className="text-[11px] font-bold text-slate-400 italic">
                Source: {scenario.explainability.sourceAttribution || 'NIST AI RMF 1.0'}
              </div>
           </div>
           {showDetails ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
        </button>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="p-12 space-y-16 animate-in slide-in-from-top-4 duration-500 bg-[#0c0f20]/50">
          
          {/* Deep Briefing Section */}
          {deepBriefing && (
            <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 bg-gradient-to-br from-purple-900/10 to-transparent p-10 rounded-[32px] border border-purple-500/10 shadow-[0_0_30px_rgba(168,85,247,0.05)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="text-purple-400" size={20} />
                  <h4 className="text-[11px] font-black uppercase text-purple-400 tracking-[0.3em]">AI Forensic Briefing</h4>
                </div>
                <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                  <Info size={12}/> decision-grade intelligence
                </div>
              </div>
              <div className="prose prose-invert max-w-none text-slate-300 font-bold leading-relaxed whitespace-pre-wrap pl-12 border-l border-purple-500/20 ml-2">
                {deepBriefing}
              </div>
            </div>
          )}

          {/* Observability Signals */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <Eye className="text-emerald-500" size={20} />
              <h4 className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.3em]">Signal Intelligence</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-12">
               {scenario.observabilitySignals.map((signal, idx) => (
                 <div key={idx} className="bg-[#1a1f3d] p-6 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-[9px] font-black text-slate-500 uppercase">{signal.type}</span>
                       {signal.isCoveredBySLO ? <CheckCircle2 className="text-emerald-500" size={14}/> : <ShieldAlert className="text-amber-500" size={14}/>}
                    </div>
                    <div className="text-sm font-black text-white">{signal.signalName}</div>
                    <div className="text-[10px] font-bold text-slate-400 italic">Detection Gap: {signal.detectionGapMinutes}m</div>
                 </div>
               ))}
            </div>
          </div>

          {/* Adversarial Chain */}
          <div className="space-y-10">
            <div className="flex items-center gap-3">
              <Activity className="text-blue-500" size={20} />
              <h4 className="text-[11px] font-black uppercase text-blue-400 tracking-[0.3em]">Cascade Simulation (Failure DAG)</h4>
            </div>
            <div className="space-y-12 pl-12">
              {scenario.causalChain.map((step, idx) => (
                <div key={idx} className="flex gap-8 relative group">
                  <div className="flex-none">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-black text-white shadow-lg z-10 relative">
                      {idx + 1}
                    </div>
                    {idx < scenario.causalChain.length - 1 && (
                      <div className="absolute top-10 left-5 w-px h-16 bg-blue-600/30" />
                    )}
                  </div>
                  <div className="space-y-2 pt-1">
                    <p className="text-lg font-bold text-white leading-snug">{step.description}</p>
                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                       <span className="text-[#f43f5e]">Trigger:</span> {step.trigger}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
