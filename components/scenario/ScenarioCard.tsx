
import React, { useState } from 'react';
import { FailureScenario, UserRole } from '../../types/forensic.types';
import { Zap, ChevronDown, ChevronUp, Activity, Clock, Target, HelpCircle, Sparkles, Loader2, Info, Eye, CheckCircle2, ShieldAlert } from 'lucide-react';
import { explainFailureDeeply } from '../../services/ai/gemini.service';

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
    if (deepBriefing) { setDeepBriefing(null); return; }
    setExplaining(true); setShowDetails(true);
    try {
      const briefing = await explainFailureDeeply(scenario, "Enterprise Architecture");
      setDeepBriefing(briefing);
    } catch (err) { alert("Briefing failed."); } finally { setExplaining(false); }
  };

  return (
    <div className="bg-[#12162b] border border-white/5 rounded-[40px] overflow-hidden shadow-2xl transition-all">
      <div className="p-10 flex flex-col md:flex-row justify-between gap-8 items-start">
        <div className="flex items-start gap-8 flex-1">
          <div className="p-5 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl border border-white/10">
            <Zap className="text-purple-400" size={32} />
          </div>
          <div className="space-y-4">
            <h3 className="text-4xl font-black text-white italic">{scenario.title}</h3>
            <div className="flex flex-wrap gap-4 items-center">
              <span className="text-[10px] font-black text-[#f43f5e] uppercase tracking-widest bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">Prob: {scenario.probability}%</span>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Blast: {scenario.blastRadius}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDeepExplain} disabled={explaining} className="flex items-center gap-2 px-5 py-2 bg-purple-600/20 border border-purple-500/30 text-purple-400 text-[10px] font-black rounded-full uppercase tracking-widest">
            {explaining ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} Briefing
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 border-y border-white/5">
        <div className="p-8 border-r border-white/5"><span className="text-[9px] font-black text-slate-600 uppercase">Detectability</span><div className="text-xl font-black text-white">{scenario.detectability}</div></div>
        <div className="p-8 border-r border-white/5"><span className="text-[9px] font-black text-slate-600 uppercase">Downtime</span><div className="text-xl font-black text-white">{scenario.expectedDowntimeHours}h</div></div>
        <div className="p-8 border-r border-white/5"><span className="text-[9px] font-black text-slate-600 uppercase">Impact</span><div className="text-xl font-black text-white">{scenario.revenueImpactRange}</div></div>
        <button onClick={() => setShowDetails(!showDetails)} className="p-8 flex items-center justify-between hover:bg-white/5 transition-all text-left">
           <div><span className="text-[9px] font-black text-blue-400 uppercase">Forensic Path</span><div className="text-[11px] font-bold text-slate-400">Source: NIST AI RMF</div></div>
           {showDetails ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      {isExpanded && (
        <div className="p-12 space-y-16 bg-[#0c0f20]/50">
          {deepBriefing && <div className="p-10 bg-purple-900/10 border border-purple-500/10 rounded-[32px] text-slate-300 whitespace-pre-wrap">{deepBriefing}</div>}
          <div className="space-y-8">
            <h4 className="text-[11px] font-black uppercase text-emerald-400">Signal Intelligence</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {scenario.observabilitySignals.map((signal, idx) => (
                 <div key={idx} className="bg-[#1a1f3d] p-6 rounded-2xl border border-white/5">
                    <div className="text-[9px] font-black text-slate-500">{signal.type}</div>
                    <div className="text-sm font-black text-white">{signal.signalName}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
