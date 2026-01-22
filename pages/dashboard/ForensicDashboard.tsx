
import React, { useState, useRef, useEffect } from 'react';
import { Loader2, ShieldAlert, Activity, LayoutDashboard, Download, Radar, RefreshCcw, Cpu, Target, LogOut, Terminal, Clock } from 'lucide-react';
import { runPreMortem } from '../../services/ai/gemini.service';
import { PreMortemAnalysis } from '../../types/forensic.types';
import { UserSession } from '../../services/auth/auth.service';
import { ScenarioCard } from '../../components/scenario/ScenarioCard';
import { ExecutiveDashboard, SystemStatusManifest } from '../../components/dashboard/ExecutiveDashboard';
import { generateForensicPDF } from '../../services/reports/pdf.service';

interface ForensicDashboardProps { session: UserSession; onLogout: () => void; }
type NavigationTab = 'INPUT' | 'INVENTORY' | 'DASHBOARD' | 'DIAGNOSTICS';

const LOADING_STAGES = [
  "Initializing Adversarial Engine...",
  "Mapping Architectural Attack Surface...",
  "Synthesizing Failure Vectors...",
  "Simulating Cascade Chains...",
  "Calculating Bayesian Risk Scores...",
  "Compiling Forensic Dossier...",
  "Finalizing Decision Matrix..."
];

const RiskCircle = ({ score }: { score: number }) => {
  const size = 80;
  const strokeWidth = 8;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 30) return '#10b981'; // Emerald
    if (s < 70) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose/Red
  };

  return (
    <div className="relative flex items-center justify-center group" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${getColor(score)}44)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-black text-white leading-none">{score}%</span>
        <span className="text-[6px] font-black text-slate-500 uppercase tracking-tighter mt-0.5">Risk</span>
      </div>
      <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity blur-[1px] animate-pulse" />
    </div>
  );
};

export const ForensicDashboard: React.FC<ForensicDashboardProps> = ({ session, onLogout }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('INPUT');
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stack, setStack] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [results, setResults] = useState<PreMortemAnalysis | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStage(prev => (prev + 1) % LOADING_STAGES.length);
      }, 3500);
    } else {
      setLoadingStage(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAnalyze = async () => {
    if (!stack.trim() || !projectTitle.trim()) return;
    setLoading(true);
    try {
      const data = await runPreMortem(description, stack, 'Adversarial', projectTitle, description, 'PRO');
      setResults(data); setActiveTab('DASHBOARD');
    } catch (err) { 
      console.error(err);
      alert("Analysis failed. The engine might be under heavy load."); 
    } finally { setLoading(false); }
  };

  const handleReset = () => {
    if (window.confirm("Initialize new forensic simulation? Current session data, title, architecture, and stack inputs will be purged.")) {
      setResults(null); 
      setProjectTitle(''); 
      setDescription(''); 
      setStack(''); 
      setActiveTab('INPUT');
    }
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: NavigationTab, icon: any, label: string }) => (
    <button 
      onClick={() => results && setActiveTab(tab)} 
      disabled={!results && tab !== 'INPUT'} 
      className={`p-4 rounded-2xl transition-all relative group ${activeTab === tab ? 'text-[#f43f5e] bg-white/5' : 'text-slate-600 hover:text-slate-300'} ${(!results && tab !== 'INPUT') ? 'opacity-20 cursor-not-allowed' : ''}`}
    >
      <Icon size={24} />
      {activeTab === tab && <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#f43f5e] rounded-r-full" />}
      <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-[9px] text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[110] pointer-events-none">{label}</div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-['Space_Grotesk'] pl-24">
      <nav className="fixed left-0 top-0 h-full w-24 bg-[#0a0d1a] border-r border-white/5 flex flex-col items-center py-10 gap-12 z-[100]">
        <div onClick={() => setActiveTab('INPUT')} className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(220,38,38,0.3)] transition-transform hover:scale-105 active:scale-95"><ShieldAlert className="text-white" size={30} /></div>
        <div className="flex-1 flex flex-col gap-10">
          <NavButton tab="INPUT" icon={Activity} label="COMMAND CENTER" />
          <NavButton tab="INVENTORY" icon={LayoutDashboard} label="FORENSIC INVENTORY" />
          <NavButton tab="DASHBOARD" icon={Target} label="RISK ANALYSIS" />
          <NavButton tab="DIAGNOSTICS" icon={Cpu} label="SYSTEM STATUS" />
          <div className="mt-auto flex flex-col gap-6">
            <button onClick={handleReset} className="text-slate-600 hover:text-amber-500 p-4 transition-colors" title="Purge Simulation State"><RefreshCcw size={24} /></button>
            <button onClick={onLogout} className="text-slate-600 hover:text-red-500 p-4 transition-colors" title="Logout"><LogOut size={24} /></button>
          </div>
        </div>
      </nav>
      <header className="h-28 border-b border-white/5 flex items-center justify-between px-16 sticky top-0 bg-[#020617]/80 backdrop-blur-xl z-50">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black italic tracking-tight">Nexus <span className="text-[#f43f5e]">Forensic_Engine</span></h2>
          <div className="text-[10px] font-black text-slate-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AGENT ID: {session.agentId} | ACCESS: {session.accessLevel}
          </div>
        </div>
        
        {results && (
          <div className="flex items-center gap-8 animate-in slide-in-from-right-4 duration-500">
            <div className="text-right">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Exposure Calculated</div>
              <div className="text-sm font-black text-[#f43f5e] italic uppercase tracking-tighter">Forensic Grade Simulation</div>
            </div>
            <RiskCircle score={results.overallRiskScore} />
          </div>
        )}
      </header>
      <div className="p-16 max-w-[1400px] mx-auto">
        {activeTab === 'INPUT' && (
          <div className="bg-[#0a0d1a] border border-white/5 rounded-[56px] p-16 shadow-2xl space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 overflow-hidden relative">
             <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Radar size={180} className="text-[#f43f5e] animate-spin-slow" />
             </div>
             
             <div className="grid grid-cols-1 gap-12 relative z-10">
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-2">PROJECT TITLE</label>
                  <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="w-full bg-[#020617] p-8 rounded-3xl border border-white/5 text-lg font-bold text-white outline-none focus:border-[#f43f5e]/30 transition-all placeholder:text-slate-800" placeholder="e.g. Autonomous Logistics AI" />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-2">ARCHITECTURAL SPECIFICATION</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full h-40 bg-[#020617] p-8 rounded-3xl border border-white/5 text-lg font-bold text-white outline-none focus:border-[#f43f5e]/30 resize-none transition-all placeholder:text-slate-800" placeholder="Describe components, data flows, and critical paths..." />
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest ml-2">TECHNOLOGICAL STACK</label>
                  <input value={stack} onChange={e => setStack(e.target.value)} className="w-full bg-[#020617] p-8 rounded-3xl border border-white/5 text-lg font-bold text-white outline-none focus:border-[#f43f5e]/30 transition-all placeholder:text-slate-800" placeholder="React, Python, AWS, PostgreSQL..." />
                </div>
             </div>
             
             <div className="space-y-6">
               <button onClick={handleAnalyze} disabled={loading} className="w-full py-10 bg-[#f43f5e] hover:bg-[#fb7185] active:scale-[0.99] text-white rounded-full font-black uppercase tracking-[0.5em] text-[14px] shadow-[0_20px_50px_rgba(244,63,94,0.3)] flex items-center justify-center gap-6 disabled:opacity-50 transition-all relative overflow-hidden group">
                  {loading ? <Loader2 className="animate-spin" size={28}/> : <Activity size={28}/>} 
                  {loading ? 'GENERATING SIMULATION...' : 'INITIALIZE FORENSIC SIMULATION'}
                  <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
               </button>
               
               {loading && (
                 <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                    <div className="flex items-center gap-3 text-slate-400 font-bold italic">
                      <Terminal size={14} className="text-[#f43f5e]" />
                      <span className="text-sm tracking-tight">{LOADING_STAGES[loadingStage]}</span>
                    </div>
                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f43f5e] shimmer rounded-full" style={{ width: `${((loadingStage + 1) / LOADING_STAGES.length) * 100}%` }} />
                    </div>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Complex reasoning in progress. Do not disconnect.</p>
                 </div>
               )}
             </div>
          </div>
        )}
        {results && activeTab !== 'INPUT' && (
          <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
             <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">Forensic Overview</h2>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">{projectTitle}</div>
                </div>
                <button onClick={() => generateForensicPDF(reportRef.current!, projectTitle)} className="flex items-center gap-4 px-10 py-5 bg-[#f43f5e] hover:bg-[#fb7185] transition-colors text-white rounded-2xl text-[11px] font-black uppercase shadow-xl shadow-red-900/10">
                  <Download size={20}/> Export Dossier
                </button>
             </div>
             <div ref={reportRef} className="space-y-20 pb-20">
                {activeTab === 'DASHBOARD' && <ExecutiveDashboard metrics={results.executiveMetrics} overallScore={results.overallRiskScore} />}
                {activeTab === 'INVENTORY' && <div className="space-y-12">{results.scenarios.map((s, idx) => <ScenarioCard key={idx} scenario={s} role="Admin" />)}</div>}
                {activeTab === 'DIAGNOSTICS' && (
                  <div className="space-y-16">
                    <SystemStatusManifest />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="bg-[#0a0d1a] border border-white/5 p-12 rounded-[56px] space-y-6">
                        <div className="flex items-center gap-3 text-blue-400">
                          <Clock size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Historical Correlation Timeline</span>
                        </div>
                        <p className="text-slate-300 font-bold italic text-lg leading-relaxed">"{results.failureTimeline}"</p>
                      </div>
                      <div className="bg-[#0a0d1a] border border-white/5 p-12 rounded-[56px] space-y-6">
                        <div className="flex items-center gap-3 text-[#f43f5e]">
                          <ShieldAlert size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Stack-Specific Vulnerabilities</span>
                        </div>
                        <ul className="space-y-3">
                          {results.stackVulnerabilities.map((v, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-400 font-bold">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f43f5e]" />
                              {v}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
