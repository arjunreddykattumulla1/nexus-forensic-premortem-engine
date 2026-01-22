
import React from 'react';
import { ShieldAlert, Cpu } from 'lucide-react';
import { Auth } from '../../components/auth/Auth';
import { UserSession } from '../../services/auth/auth.service';

interface AuthPageProps {
  onAuthSuccess: (session: UserSession) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-['Space_Grotesk'] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-red-500/10 rounded-full blur-[200px] animate-pulse pointer-events-none" />
      <div className="w-full max-w-[480px] space-y-12 relative z-10">
        <div className="text-center space-y-5">
          <div className="inline-flex p-6 bg-red-500/5 rounded-[2.5rem] border border-red-500/10 shadow-[0_0_60px_rgba(244,63,94,0.15)]">
            <ShieldAlert className="text-[#f43f5e]" size={64} />
          </div>
          <h1 className="text-5xl font-black uppercase italic text-white leading-none">Nexus <span className="text-[#f43f5e]">Vault</span></h1>
          <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Forensic Access Protocol</p>
        </div>
        <Auth onAuthSuccess={onAuthSuccess} />
        <div className="flex items-center justify-center gap-4 text-slate-800">
          <Cpu size={14} /><p className="text-[9px] font-black uppercase tracking-[0.5em]">Forensic Tier L4</p>
        </div>
      </div>
    </div>
  );
};
