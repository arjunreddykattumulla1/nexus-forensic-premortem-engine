
import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ChevronRight, Loader2, 
  ShieldCheck, Terminal, Cpu, Globe, Lock
} from 'lucide-react';
import { authService, UserSession } from '../services/authService';

interface AuthPortalProps {
  onAuthSuccess: (session: UserSession) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Awaiting identity handshake...', '[SYSTEM] Secure tunnel: STANDBY']);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleAuthorize = () => {
    setLoading(true);
    addLog('Initializing biometric verification...');
    setTimeout(() => addLog('Synchronizing with Forensic Cloud...'), 600);
    setTimeout(() => addLog('Session keys generated (AES-256).'), 1200);
    setTimeout(() => {
      const session = authService.authorize();
      addLog('ACCESS GRANTED. Redirecting...');
      setTimeout(() => onAuthSuccess(session), 800);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-['Space_Grotesk'] overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/20 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <div className="w-full max-w-[500px] space-y-10 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
        {/* Branding */}
        <div className="text-center space-y-5">
          <div className="inline-flex p-5 bg-red-500/10 rounded-[2.5rem] border border-red-500/20 shadow-[0_0_60px_rgba(244,63,94,0.25)] hover:scale-110 transition-transform duration-500">
            <ShieldAlert className="text-[#f43f5e]" size={64} />
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white leading-none">
              Nexus <span className="text-[#f43f5e]">Vault</span>
            </h1>
            <p className="text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] opacity-80">Forensic Intelligence Engine</p>
          </div>
        </div>

        {/* Access Panel */}
        <div className="bg-[#0a0d1a]/80 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f43f5e] to-transparent opacity-40 shimmer" />
          
          <div className="space-y-10">
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-black text-white italic tracking-tight">Protocol Authorization</h3>
              <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
                Enterprise forensic simulation requires restricted access. Click below to initialize your secure session.
              </p>
            </div>

            <button 
              onClick={handleAuthorize}
              disabled={loading}
              className="w-full py-7 bg-[#f43f5e] hover:bg-[#fb7185] disabled:opacity-50 text-white rounded-[2rem] text-[13px] font-black uppercase tracking-[0.5em] shadow-[0_15px_50px_rgba(244,63,94,0.4)] flex items-center justify-center gap-5 transition-all hover:scale-[1.03] active:scale-95 group/btn"
            >
              {loading ? <Loader2 className="animate-spin" size={24}/> : <ShieldCheck size={24} className="group-hover/btn:rotate-12 transition-transform" />}
              {loading ? 'Authorizing...' : 'Authorize Session'}
            </button>

            {/* System Monitor */}
            <div className="bg-[#020617] p-6 rounded-[2rem] border border-white/5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <Terminal size={14} className="text-slate-600" />
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">System Monitor</span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
                </div>
              </div>
              <div className="space-y-2 min-h-[80px]">
                {logs.map((log, i) => (
                  <div key={i} className="text-[11px] font-black text-slate-500 mono truncate animate-in fade-in slide-in-from-left-2 duration-300">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-5 text-slate-800">
            <Cpu size={16} />
            <p className="text-[11px] font-black uppercase tracking-[0.5em]">L4 Secure Infrastructure</p>
          </div>
          <div className="flex justify-center gap-12">
            <button className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-red-500 transition-colors">Manifesto</button>
            <button className="text-[10px] font-black text-slate-700 uppercase tracking-widest hover:text-red-500 transition-colors">Forensic Terms</button>
          </div>
        </div>
      </div>
    </div>
  );
};
