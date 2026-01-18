
import React, { useState, useRef, useEffect } from 'react';
import { 
  Loader2, ShieldAlert, Activity, LayoutDashboard, Share2, Download, Radar, 
  RefreshCcw, Cpu, Target, Mail, ExternalLink, MessageSquare, Image as ImageIcon,
  CheckCircle2, LogOut, Terminal
} from 'lucide-react';
import { runPreMortem } from '../services/geminiService';
// Import PreMortemAnalysis from types and UserSession from authService as it is defined there
import { PreMortemAnalysis } from '../types';
import { UserSession } from '../services/authService';
import { ScenarioCard } from '../components/ScenarioCard';
import { ExecutiveDashboard, SystemStatusManifest } from '../components/ExecutiveDashboard';
import { generateForensicPDF } from '../services/pdfService';

type NavigationTab = 'INPUT' | 'INVENTORY' | 'DASHBOARD' | 'DIAGNOSTICS';
type ShareMode = 'NONE' | 'PENDING' | 'PLAIN_TEXT' | 'VISUAL_REPORT';

interface ForensicDashboardProps {
  session: UserSession;
  onLogout: () => void;
}

export const ForensicDashboard: React.FC<ForensicDashboardProps> = ({ session, onLogout }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('INPUT');
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [stack, setStack] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PreMortemAnalysis | null>(null);
  const [shareMode, setShareMode] = useState<ShareMode>('NONE');
  
  const reportRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShareMode('NONE');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAnalyze = async () => {
    if (!stack.trim() || !projectTitle.trim()) return;
    setLoading(true);
    try {
      const data = await runPreMortem(description, stack, 'Adversarial', projectTitle, description, 'PRO');
      setResults(data);
      setActiveTab('DASHBOARD');
    } catch (err) { 
      console.error(err); 
      alert("Analysis failed. Verify Gemini API Connectivity.");
    } finally { 
      setLoading(false); 
    }
  };

  const handleReset = () => {
    if (window.confirm("Initialize new forensic simulation? Current session data and inputs will be cleared.")) {
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
      className={`p-4 rounded-2xl transition-all relative group ${
        activeTab === tab 
          ? 'text-[#f43f5e] bg-white/5 shadow-[0_0_20px_rgba(244,63,94,0.15)]' 
          : 'text-slate-600 hover:text-slate-300'
      } ${(!results && tab !== 'INPUT') ? 'opacity-20 cursor-not-allowed' : ''}`}
    >
      <Icon size={24} />
      {activeTab === tab && (
        <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#f43f5e] rounded-r-full shadow-[0_0_15px_#f43f5e]" />
      )}
      <div className="absolute left-full ml-6 px-4 py-2 bg-[#0f172a] text-[10px] font-black text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[110] border border-white/10 pointer-events-none shadow-2xl">
        {label}
      </div>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-['Space_Grotesk']">
      <nav className="fixed left-0 top-0 h-full w-24 bg-[#0a0d1a] border-r border-white/5 flex flex-col items-center py-10 gap-12 z-[100]">
        <div onClick={() => setActiveTab('INPUT')} className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.3)] cursor-pointer hover:scale-105 transition-transform">
          <ShieldAlert className="text-white" size={30} />
        </div>
        <div className="flex-1 flex flex-col gap-10">
          <NavButton tab="INPUT" icon={Activity} label="COMMAND CENTER" />
          <NavButton tab="INVENTORY" icon={LayoutDashboard} label="FORENSIC INVENTORY" />
          <NavButton tab="DASHBOARD" icon={Target} label="RISK ANALYSIS" />
          <NavButton tab="DIAGNOSTICS" icon={Cpu} label="SYSTEM DIAGNOSTICS" />
          
          <div className="mt-auto flex flex-col gap-6">
            <button 
              onClick={handleReset} 
              className="text-slate-600 hover:text-amber-500 p-4 group relative transition-colors"
              title="Reset Engine"
            >
              <RefreshCcw size={24} />
              <div className="absolute left-full ml-6 px-4 py-2 bg-[#0f172a] text-[10px] font-black text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[110] border border-white/10 pointer-events-none shadow-2xl">
                RESET ENGINE
              </div>
            </button>
            <button 
              onClick={onLogout} 
              className="text-slate-600 hover:text-red-500 p-4 group relative transition-colors"
              title="Logout"
            >
              <LogOut size={24} />
              <div className="absolute left-full ml-6 px-4 py-2 bg-[#0f172a] text-[10px] font-black text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[110] border border-white/10 pointer-events-none shadow-2xl">
                TERMINATE SESSION
              </div>
            </button>
          </div>
        </div>
      </nav>

      <main className="pl-24 min-h-screen">
        <header className="h-28 border-b border-white/5 flex items-center justify-between px-16 bg-[#020617]/80 backdrop-blur-2xl sticky top-0 z-[90]">
           <div className="flex flex-col">
             <div className="flex items-center gap-4">
               <ShieldAlert className="text-[#f43f5e]" size={24} />
               <h2 className="text-2xl font-black uppercase tracking-tight italic">Nexus <span className="text-[#f43f5e]">Forensic_Engine</span></h2>
             </div>
             <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2 flex items-center gap-3">
               <span className="flex items-center gap-2">
                 <Terminal size={12} className="text-slate-700"/> Status: {loading ? 'Computing' : results ? 'Inventory_Ready' : 'Standby'}
               </span>
               <span className="h-1 w-1 rounded-full bg-slate-800" />
               <span className="text-emerald-500/80 uppercase font-black">{session.agentId} | {session.accessLevel}</span>
             </div>
           </div>
           {results && (
             <div className="text-right">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregate Exposure</div>
                <div className="text-2xl font-black text-[#f43f5e] italic">{results.overallRiskScore}%</div>
             </div>
           )}
        </header>

        <div className="p-16 max-w-[1400px] mx-auto">
           {activeTab === 'INPUT' && (
             <div className="bg-[#0a0d1a] border border-white/5 rounded-[56px] p-16 shadow-2xl space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                  <Radar size={200} className="text-red-500 animate-spin-slow" />
                </div>
                
                <div className="grid grid-cols-1 gap-12 relative z-10">
                   <div className="space-y-4">
                     <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">PROJECT TITLE</label>
                     <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="w-full bg-[#020617] p-8 rounded-3xl border border-white/5 text-lg font-bold text-white outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-800" placeholder="e.g. Medbot Healthcare AI" />
                   </div>
                   <div className="space-y-4">
                     <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">ARCHITECTURAL SPECIFICATION</label>
                     <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full h-40 bg-[#020617] p-8 rounded-3xl border border-white/5 text-lg font-bold text-white outline-none focus:border-blue-500/30 resize-none transition-all placeholder:text-slate-800" placeholder="Describe system components and data flows..." />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">TECHNOLOGICAL STACK</label>
                      <input value={stack} onChange={e => setStack(e.target.value)} className="w-full bg-[#020617] p-8 rounded-3xl border border-white/5 text-lg font-bold text-white outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-800" placeholder="React, Python, AWS, PostgreSQL..." />
                   </div>
                </div>
                <button onClick={handleAnalyze} disabled={loading} className="w-full py-10 bg-[#f43f5e] hover:bg-[#fb7185] hover:scale-[1.01] active:scale-95 text-white rounded-full font-black uppercase tracking-[0.5em] text-[14px] shadow-[0_20px_50px_rgba(244,63,94,0.3)] flex items-center justify-center gap-6 transition-all disabled:opacity-50 relative group">
                   {loading ? <Loader2 className="animate-spin" size={28}/> : <Activity size={28}/>} 
                   {loading ? 'COMPILING ADVERSARIAL MODELS...' : 'INITIALIZE FORENSIC SIMULATION'}
                </button>
             </div>
           )}

           {results && activeTab !== 'INPUT' && (
             <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="flex justify-between items-end">
                   <div>
                     <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white">
                        {activeTab === 'DASHBOARD' && 'Executive Risk Analysis'}
                        {activeTab === 'INVENTORY' && 'Forensic Inventory'}
                        {activeTab === 'DIAGNOSTICS' && 'System Health Diagnostics'}
                     </h2>
                   </div>
                   <div className="flex gap-6">
                      <button onClick={() => generateForensicPDF(reportRef.current!, projectTitle)} className="flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#f43f5e] to-[#fb7185] hover:opacity-90 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-[0_15px_40px_rgba(244,63,94,0.3)] transition-all">
                        <Download size={20}/> Export Dossier
                      </button>
                   </div>
                </div>

                <div id="forensic-report-export" ref={reportRef} className="space-y-20 pb-20">
                   {activeTab === 'DASHBOARD' && <ExecutiveDashboard metrics={results.executiveMetrics} overallScore={results.overallRiskScore} />}
                   {activeTab === 'INVENTORY' && (
                     <div className="space-y-12">
                        {results.scenarios.map((s, idx) => <ScenarioCard key={idx} scenario={s} role="Admin" />)}
                     </div>
                   )}
                   {activeTab === 'DIAGNOSTICS' && (
                     <div className="space-y-16">
                        <SystemStatusManifest />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                           <div className="bg-[#0a0d1a] border border-white/5 p-12 rounded-[56px] space-y-6 shadow-xl relative overflow-hidden">
                              <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em]">Bayesian Timeline Analysis</h4>
                              <p className="text-slate-300 font-bold italic text-lg leading-relaxed">"{results.failureTimeline}"</p>
                           </div>
                           <div className="bg-[#0a0d1a] border border-white/5 p-12 rounded-[56px] space-y-6 shadow-xl relative overflow-hidden">
                              <h4 className="text-[11px] font-black text-red-500 uppercase tracking-[0.4em]">Vulnerability Attack Surface</h4>
                              <div className="space-y-4">
                                 {results.stackVulnerabilities.map((v, i) => (
                                   <div key={i} className="text-md font-bold text-slate-200 flex items-center gap-5 bg-white/5 p-4 rounded-2xl border border-white/5">
                                     <div className="w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_#dc2626]"/>
                                     {v}
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                   )}
                </div>
             </div>
           )}
        </div>
      </main>
    </div>
  );
};
