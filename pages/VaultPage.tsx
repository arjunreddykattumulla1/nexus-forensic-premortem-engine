
import React from 'react';
import { ShieldAlert, Cpu } from 'lucide-react';
import { Auth } from '../components/Auth';
import { UserSession } from '../services/authService';

interface VaultPageProps {
  onAuthSuccess: (session: UserSession) => void;
}

export const VaultPage: React.FC<VaultPageProps> = ({ onAuthSuccess }) => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-['Space_Grotesk'] overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-red-500/10 rounded-full blur-[200px] animate-pulse" />
      </div>

      <div className="w-full max-w-[480px] space-y-12 animate-in fade-in zoom-in-95 duration-1000 relative z-10">
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

        <Auth onAuthSuccess={onAuthSuccess} />

        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4 text-slate-800">
            <Cpu size={14} />
            <p className="text-[9px] font-black uppercase tracking-[0.5em]">Forensic Infrastructure Tier L4</p>
          </div>
        </div>
      </div>
    </div>
  );
};
