
import React, { useState, useRef, useEffect } from 'react';
import { 
  Loader2, ShieldAlert, Activity, Zap, 
  LayoutDashboard, Share2, Download, Radar, 
  BarChart3, Globe, RefreshCcw, Shield,
  Cpu, FileText, ChevronRight, Clock, Target,
  Mail, ExternalLink, MessageSquare, Image as ImageIcon,
  CheckCircle2, XCircle, LogOut, Terminal
} from 'lucide-react';
import { runPreMortem } from './services/geminiService';
import { PreMortemAnalysis } from './types';
import { ScenarioCard } from './components/ScenarioCard';
import { ExecutiveDashboard, SystemStatusManifest } from './components/ExecutiveDashboard';
import { generateForensicPDF } from './services/pdfService';
import { AuthPortal } from './components/AuthPortal';
import { authService, UserSession } from './services/authService';

type NavigationTab = 'INPUT' | 'INVENTORY' | 'DASHBOARD' | 'DIAGNOSTICS';
type ShareMode = 'NONE' | 'PENDING' | 'PLAIN_TEXT' | 'VISUAL_REPORT';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(authService.getSession());
  const [activeTab, setActiveTab] = useState<NavigationTab>('INPUT');
  const [projectTitle, setProjectTitle] = useState('Medbot: Intelligent chatbot for digital healthcare');
  const [description, setDescription] = useState('Built an AI-powered chatbot providing medical guidance, symptom analysis, appointment scheduling and medication reminders');
  const [stack, setStack] = useState('NLP, TensorFlow, Flask, Huggingface');
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

  const handleLogout = () => {
    if (window.confirm("Terminating session. All temporary forensic data will be cleared. Continue?")) {
      authService.terminate();
      setSession(null);
      setResults(null);
      setActiveTab('INPUT');
    }
  };

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

  const getShareLinks = (mode: ShareMode) => {
    if (!results || mode === 'NONE' || mode === 'PENDING') return null;
    
    const subject = encodeURIComponent(`[Nexus Forensic Dossier] ${projectTitle}`);
    let bodyText = "";

    if (mode === 'PLAIN_TEXT') {
      bodyText = `NEXUS CORPORATE ENGINE - FORENSIC SUMMARY\n` +
                 `-----------------------------------------\n` +
                 `PROJECT: ${projectTitle}\n` +
                 `VERDICT: ${results.executiveMetrics.decisionStatus}\n` +
                 `EXPOSURE: ${results.overallRiskScore}%\n` +
                 `CONFIDENCE: ${results.simulationConfidence}%\n\n` +
                 `TOP RISKS:\n` +
                 `${results.executiveMetrics.topSystemicRisks.map(r => `• ${r}`).join('\n')}\n\n` +
                 `DIAGNOSIS:\n` +
                 `${results.forensicVerdict}`;
    } else {
      const score = results.overallRiskScore;
      const confidence = results.simulationConfidence;
      const riskBar = "█".repeat(Math.floor(score / 5)) + "░".repeat(20 - Math.floor(score / 5));
      const confBar = "■".repeat(Math.floor(confidence / 10)) + "□".repeat(10 - Math.floor(confidence / 10));
      
      bodyText = `NEXUS CORPORATE ENGINE - VISUAL FORENSIC REPORT\n` +
                 `==================================================\n` +
                 `PROJECT : ${projectTitle}\n` +
                 `TIMESTAMP : ${new Date().toLocaleString()}\n` +
                 `==================================================\n\n` +
                 `[1] GLOBAL RISK EXPOSURE GAUGE\n` +
                 `--------------------------------------------------\n` +
                 `RISK: [ ${riskBar} ] ${score}% (${results.executiveMetrics.decisionStatus})\n` +
                 `CONF: [ ${confBar} ] ${confidence}% (SIMULATION STRENGTH)\n\n` +
                 `[2] EXECUTIVE DASHBOARD SUMMARY\n` +
                 `+--------------------+----------------------------+\n` +
                 `| METRIC             | VALUE                      |\n` +
                 `+--------------------+----------------------------+\n` +
                 `| READINESS SCORE    | ${results.executiveMetrics.readinessScore}%                        |\n` +
                 `| COST OF INACTION   | ${results.executiveMetrics.costOfInaction.padEnd(26)} |\n` +
                 `| SLA IMPACT         | ${results.executiveMetrics.slaImpact}% (POTENTIAL LOSS)         |\n` +
                 `+--------------------+----------------------------+\n\n` +
                 `[3] TOP SYSTEMIC FAILURES (BY MAGNITUDE)\n` +
                 `--------------------------------------------------\n` +
                 `${results.executiveMetrics.topSystemicRisks.map((r, i) => `[${i+1}] ${r}`).join('\n')}\n\n` +
                 `[4] SYSTEM VULNERABILITY ARCHITECTURE\n` +
                 `--------------------------------------------------\n` +
                 `${results.stackVulnerabilities.map(v => `• CRITICAL_VULN: ${v}`).join('\n')}\n\n` +
                 `[5] FORENSIC VERDICT\n` +
                 `--------------------------------------------------\n` +
                 `${results.forensicVerdict}\n\n` +
                 `--\n` +
                 `REPORT GENERATED BY NEXUS FORENSIC AI ENGINE v2.5\n` +
                 `VISUAL_REPORT_FORMAT = TRUE`;
    }

    const body = encodeURIComponent(bodyText);

    return {
      gmail: `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${subject}&body=${body}`,
      outlook: `https://outlook.office.com/mail/deeplink/compose?subject=${subject}&body=${body}`,
      mailto: `mailto:?subject=${subject}&body=${body}`
    };
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

  const shareLinks = getShareLinks(shareMode);

  if (!session || !session.isAuthenticated) {
    return <AuthPortal onAuthSuccess={setSession} />;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-['Space_Grotesk']">
      {/* Sidebar Navigation */}
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
            <button onClick={() => window.confirm("Reset simulation? Current forensic context will be purged.") && setResults(null)} className="text-slate-600 hover:text-amber-500 p-4 group relative transition-colors">
              <RefreshCcw size={24} />
              <div className="absolute left-full ml-6 px-4 py-2 bg-[#0f172a] text-[10px] font-black text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[110] border border-white/10 pointer-events-none shadow-2xl">RESET</div>
            </button>
            <button onClick={handleLogout} className="text-slate-600 hover:text-red-500 p-4 group relative transition-colors">
              <LogOut size={24} />
              <div className="absolute left-full ml-6 px-4 py-2 bg-[#0f172a] text-[10px] font-black text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap z-[110] border border-white/10 pointer-events-none shadow-2xl">TERMINATE</div>
            </button>
          </div>
        </div>
      </nav>

      <main className="pl-24 min-h-screen">
        {/* Header */}
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
                     <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="w-full bg-[#020617] p-8 rounded-3xl border border-white/5 text-lg font-bold text-white outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-800" placeholder="System ID..." />
                   </div>
                   <div className="space-y-4">
                     <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">ARCHITECTURAL SPECIFICATION</label>
                     <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full h-40 bg-[#020617] p-8 rounded-3xl border border-white/5 text-lg font-bold text-white outline-none focus:border-blue-500/30 resize-none transition-all placeholder:text-slate-800" placeholder="Describe the machine logic..." />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase text-slate-500 tracking-[0.3em] ml-2">TECHNOLOGICAL STACK</label>
                      <input value={stack} onChange={e => setStack(e.target.value)} className="w-full bg-[#020617] p-8 rounded-3xl border border-white/5 text-lg font-bold text-white outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-800" placeholder="React, AWS, Python..." />
                   </div>
                </div>
                <button onClick={handleAnalyze} disabled={loading} className="w-full py-10 bg-[#f43f5e] hover:bg-[#fb7185] hover:scale-[1.01] active:scale-95 text-white rounded-full font-black uppercase tracking-[0.5em] text-[14px] shadow-[0_20px_50px_rgba(244,63,94,0.3)] flex items-center justify-center gap-6 transition-all disabled:opacity-50 relative group">
                   <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
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
                     <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mt-3">PROJECT_ID: {projectTitle}</p>
                   </div>
                   <div className="flex gap-6 relative" ref={shareMenuRef}>
                      <button 
                        onClick={() => setShareMode(shareMode === 'NONE' ? 'PENDING' : 'NONE')} 
                        className={`flex items-center gap-4 px-10 py-5 ${shareMode !== 'NONE' ? 'bg-[#f43f5e] text-white shadow-[0_0_30px_rgba(244,63,94,0.4)]' : 'bg-[#12162b] text-white'} rounded-2xl text-[11px] font-black uppercase tracking-widest border border-white/5 hover:bg-[#1a203f] transition-all`}
                      >
                        <Share2 size={20}/> Share Briefing
                      </button>

                      {shareMode !== 'NONE' && (
                        <div className="absolute right-0 top-full mt-4 w-80 bg-[#0a0d1a] border border-white/10 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] p-6 z-[150] animate-in fade-in zoom-in-95 duration-300 ring-1 ring-white/10">
                          <div className="text-[11px] font-black text-blue-400 uppercase tracking-[0.3em] mb-5 border-b border-white/5 pb-3">Select Output Protocol</div>
                          
                          <div className="space-y-4">
                            <button 
                              onClick={() => setShareMode('PLAIN_TEXT')} 
                              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border ${shareMode === 'PLAIN_TEXT' ? 'bg-[#f43f5e]/10 border-[#f43f5e]/40 text-white shadow-[inset_0_0_15px_rgba(244,63,94,0.1)]' : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'}`}
                            >
                              <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-wider">
                                <MessageSquare size={18}/> Plain Summary
                              </div>
                              {shareMode === 'PLAIN_TEXT' && <CheckCircle2 size={16} className="text-[#f43f5e]" />}
                            </button>
                            
                            <button 
                              onClick={() => setShareMode('VISUAL_REPORT')} 
                              className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border ${shareMode === 'VISUAL_REPORT' ? 'bg-blue-500/10 border-blue-500/40 text-white shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]' : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'}`}
                            >
                              <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-wider">
                                <ImageIcon size={18}/> Visual Report
                              </div>
                              {shareMode === 'VISUAL_REPORT' && <CheckCircle2 size={16} className="text-blue-400" />}
                            </button>
                          </div>

                          {(shareMode === 'PLAIN_TEXT' || shareMode === 'VISUAL_REPORT') && (
                            <div className="mt-8 pt-6 border-t border-white/5 animate-in slide-in-from-top-4 duration-500">
                               <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Identity Hub Dispatch</div>
                               <div className="grid grid-cols-1 gap-3">
                                  {['Gmail', 'Outlook'].map(p => (
                                    <a key={p} href={(shareLinks as any)[p.toLowerCase()]} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-5 py-3.5 bg-white/5 hover:bg-white/10 hover:scale-[1.02] rounded-xl text-[10px] font-black uppercase text-slate-300 transition-all">
                                      <div className="flex items-center gap-3">
                                        <Mail size={16} className="text-blue-500" /> {p} Dispatch
                                      </div>
                                      <ExternalLink size={12} className="opacity-30" />
                                    </a>
                                  ))}
                               </div>
                            </div>
                          )}
                          
                          {shareMode === 'PENDING' && (
                            <div className="mt-6 text-center py-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
                              <p className="text-[10px] font-bold text-slate-600 italic leading-relaxed px-4">Awaiting selection of forensic reporting format for briefing generation.</p>
                            </div>
                          )}
                        </div>
                      )}
                      
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
                              <div className="absolute top-0 left-0 w-2 h-full bg-blue-500/20" />
                              <h4 className="text-[11px] font-black text-blue-500 uppercase tracking-[0.4em]">Bayesian Timeline Analysis</h4>
                              <p className="text-slate-300 font-bold italic text-lg leading-relaxed">"{results.failureTimeline}"</p>
                           </div>
                           <div className="bg-[#0a0d1a] border border-white/5 p-12 rounded-[56px] space-y-6 shadow-xl relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-2 h-full bg-red-500/20" />
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

export default App;
