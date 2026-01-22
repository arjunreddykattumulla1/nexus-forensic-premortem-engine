
import React, { useState } from 'react';
import { ShieldAlert, Loader2, Key, Lock, Terminal } from 'lucide-react';
import { authService, UserSession } from '../../services/auth/auth.service';

interface AuthProps {
  onAuthSuccess: (session: UserSession) => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
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
            Authorize session to sync with Nexus Adversarial Engine.
          </p>
        </div>
        <div className="space-y-6">
          <button 
            onClick={handleAuthorize}
            disabled={loading}
            className="w-full py-7 bg-[#f43f5e] hover:bg-[#fb7185] disabled:opacity-50 text-white rounded-[2rem] text-[13px] font-black uppercase tracking-[0.4em] shadow-[0_15px_60px_rgba(244,63,94,0.35)] flex items-center justify-center gap-5 transition-all hover:scale-[1.02] active:scale-95 relative group overflow-hidden"
          >
            {loading ? <Loader2 className="animate-spin" size={24}/> : <Key size={24} />}
            <span>{loading ? 'Handshaking...' : 'Authorize Session'}</span>
          </button>
          <div className="bg-[#020617] p-6 rounded-[2rem] border border-white/5 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <Terminal size={12} className="text-slate-700" />
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Log Stream</span>
            </div>
            <div className="space-y-1.5 min-h-[70px]">
              {logs.map((log, i) => (
                <div key={i} className="text-[10px] font-bold text-slate-600 mono truncate italic">{log}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
