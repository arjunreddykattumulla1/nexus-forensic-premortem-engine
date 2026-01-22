import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ExecutiveMetrics } from '../../types/forensic.types';
import { Target, DollarSign } from 'lucide-react';

const LargeRiskGauge = ({ score }: { score: number }) => {
  const size = 200;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s < 30) return '#10b981'; // Emerald
    if (s < 70) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-[#0a0d1a] border border-white/5 rounded-[56px] shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      <div className="relative mb-6">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="rgba(255,255,255,0.03)"
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
            className="transition-all duration-[1500ms] ease-out"
            style={{ filter: `drop-shadow(0 0 15px ${getColor(score)}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-black text-white italic tracking-tighter">{score}%</span>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-2">Aggregate Risk</span>
        </div>
      </div>
      <div className="text-center space-y-1">
        <div className={`text-[11px] font-black uppercase tracking-widest px-4 py-1 rounded-full border ${
          score < 30 ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
          score < 70 ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 
          'text-red-500 border-red-500/20 bg-red-500/5'
        }`}>
          {score < 30 ? 'Architecture_Resilient' : score < 70 ? 'Elevated_Vulnerability' : 'Critical_Exposure_Detected'}
        </div>
      </div>
    </div>
  );
};

export const SystemStatusManifest = () => (
  <div className="bg-[#12162b] border border-white/5 rounded-[40px] p-10 space-y-8 mb-12 shadow-xl">
    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Internal System Diagnostics</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
      {['Bayesian Model', 'Monte Carlo Sim', 'Observability Hooks', 'Risk Propensity'].map((s, i) => (
        <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-[11px] font-black text-slate-300">{s.toUpperCase()}</span>
          <span className="text-[11px] font-black text-emerald-500 uppercase italic flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            Successful
          </span>
        </div>
      ))}
    </div>
  </div>
);

export const ExecutiveDecisionDashboard: React.FC<{ metrics: ExecutiveMetrics, overallScore: number }> = ({ metrics, overallScore }) => {
  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <LargeRiskGauge score={overallScore} />
        <div className="space-y-6">
          <SystemStatusManifest />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-8 rounded-[40px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-center">
              <div className="text-[10px] font-black uppercase tracking-widest mb-2">Decision Status</div>
              <div className="text-4xl font-black italic">{metrics.decisionStatus}</div>
            </div>
            <div className="bg-[#12162b] p-8 rounded-[40px] border border-white/5 text-center">
              <div className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                <DollarSign size={12} /> Cost of Inaction
              </div>
              <div className="text-2xl font-black text-white italic">{metrics.costOfInaction}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#12162b] p-10 rounded-[40px] border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Historical Risk Trend (Simulation)</h3>
           <Target className="text-blue-500" size={16} />
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.riskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
              <XAxis dataKey="month" stroke="#475569" fontSize={10} fontWeight="900" />
              <YAxis stroke="#475569" fontSize={10} fontWeight="900" />
              <Tooltip 
                contentStyle={{ background: '#0a0d1a', border: '1px solid #ffffff10', borderRadius: '16px' }} 
                itemStyle={{ color: '#fff', fontSize: '10px' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={5} 
                dot={{ r: 6, fill: '#3b82f6', strokeWidth: 0 }} 
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
