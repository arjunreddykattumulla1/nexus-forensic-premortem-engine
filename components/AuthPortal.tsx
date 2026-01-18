
import React, { useState } from 'react';
import { 
  ShieldAlert, Loader2, ShieldCheck, 
  Terminal, Cpu, Globe, Lock, Key
} from 'lucide-react';
import { authService, UserSession } from '../services/authService';

interface AuthPortalProps {
  onAuthSuccess: (session: UserSession) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onAuthSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Awaiting identity handshake...',
    '[SYSTEM] Secure tunnel: STANDBY'
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const handleAuthorize = () => {
    setLoading(true);
    addLog('Initializing cryptographic handshake...');
    setTimeout(() => addLog('Rotating vault keys...'), 600);
    setTimeout(() => addLog('Biometric signature verified.'), 1200);
    setTimeout(() => {
      const session = authService.authorize();
      addLog('ACCESS GRANTED. Redirecting...');
      setTimeout(() => onAuthSuccess(session), 800);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-['Space_Grotesk'] overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-red-500/10 rounded-full blur-[200px] animate-pulse" />
      </div>

      <div className="w-full max-w-[480px] space-y-12 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
        {/* Branding */}
        <div className="text-center space-y-5">
          <div className="inline-flex p-6 bg-red-500/5 rounded-[2.5rem] border border-red-500/10 shadow-[0_0_60px_rgba(244,63,94,0.15)] group">
            <ShieldAlert className="text-[#f43f5e] group-hover:scale-110 transition-transform duration-500" size={64} />
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-white leading-none">
              Nexus <span className="text-[#f43f5e]">Vault</span>
            </h1>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] opacity-80">Forensic Access Protocol</p>
          </div>
        </div>

        {/* Access Panel */}
        <div className="bg-[#0a0d1a]/60 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f43f5e] to-transparent opacity-30 shimmer" />
          
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex gap-2 p-2 bg-white/5 rounded-full mb-2">
                 <Lock size={12} className="text-slate-600" />
                 <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Secure Entry Point</span>
              </div>
              <h3 className="text-2xl font-black text-white italic tracking-tight">Handshake Initialization</h3>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
                Click below to authorize your session and synchronize with the adversarial engine.
              </p>
            </div>

            <div className="space-y-6">
              <button 
                onClick={handleAuthorize}
                disabled={loading}
                className="w-full py-7 bg-[#f43f5e] hover:bg-[#fb7185] disabled:opacity-50 text-white rounded-[2rem] text-[13px] font-black uppercase tracking-[0.4em] shadow-[0_15px_60px_rgba(244,63,94,0.35)] flex items-center justify-center gap-5 transition-all hover:scale-[1.02] active:scale-95 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                {loading ? <Loader2 className="animate-spin relative z-10" size={24}/> : <Key size={24} className="relative z-10" />}
                <span className="relative z-10">{loading ? 'Handshaking...' : 'Authorize Session'}</span>
              </button>

              {/* Terminal Feed */}
              <div className="bg-[#020617] p-6 rounded-[2rem] border border-white/5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <Terminal size={12} className="text-slate-700" />
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Log Stream</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-slate-800" />
                    <div className="w-1 h-1 rounded-full bg-slate-800" />
                  </div>
                </div>
                <div className="space-y-1.5 min-h-[70px]">
                  {logs.map((log, i) => (
                    <div key={i} className="text-[10px] font-bold text-slate-600 mono truncate italic">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Footer */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4 text-slate-800">
            <Cpu size={14} />
            <p className="text-[9px] font-black uppercase tracking-[0.5em]">Forensic Infrastructure Tier L4</p>
          </div>
          <div className="flex justify-center gap-10">
            <button className="text-[9px] font-black text-slate-800 uppercase tracking-widest hover:text-slate-500 transition-colors">Security Whitepaper</button>
            <button className="text-[9px] font-black text-slate-800 uppercase tracking-widest hover:text-slate-500 transition-colors">Manifesto</button>
          </div>
        </div>
      </div>
    </div>
  );
};
