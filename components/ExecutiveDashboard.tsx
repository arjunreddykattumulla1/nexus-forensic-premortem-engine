
import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, ReferenceLine, LineChart, Line
} from 'recharts';
import { ExecutiveMetrics } from '../types';
import { TrendingDown, Target, AlertTriangle, CheckCircle, Info, DollarSign } from 'lucide-react';

interface ExecutiveDashboardProps {
  metrics: ExecutiveMetrics;
  overallScore: number;
}

const DecisionReadiness = ({ status, score, costOfInaction }: { status: string, score: number, costOfInaction: string }) => {
  const colors = {
    'GO': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    'NO-GO': 'text-red-500 bg-red-500/10 border-red-500/30',
    'CAUTION': 'text-amber-500 bg-amber-500/10 border-amber-500/30'
  }[status] || 'text-slate-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
       <div className={`p-8 rounded-[40px] border flex flex-col items-center justify-center gap-4 text-center ${colors}`}>
          <div className="text-[10px] font-black uppercase tracking-[0.3em]">Decision Status</div>
          <div className="text-5xl font-black italic">{status}</div>
       </div>
       <div className="bg-[#12162b] border border-white/5 p-8 rounded-[40px] flex flex-col items-center justify-center gap-4">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Readiness Score</div>
          <div className="text-5xl font-black text-white italic">{score}%</div>
       </div>
       <div className="bg-[#12162b] border border-white/5 p-8 rounded-[40px] flex flex-col items-center justify-center gap-4">
          <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <DollarSign size={12}/> Cost of Inaction
          </div>
          <div className="text-3xl font-black text-white italic text-center">{costOfInaction}</div>
       </div>
    </div>
  );
};

const RiskHeatmap = ({ data }: { data: any[] }) => {
  return (
    <div className="bg-[#12162b] border border-white/5 p-10 rounded-[40px] space-y-8 shadow-xl">
       <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4 italic text-white">
            <AlertTriangle size={32} className="text-amber-500" /> Strategic Risk Heatmap
          </h3>
          <div className="flex gap-4">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-[#0a0d1a] px-4 py-1.5 rounded-full border border-white/5">
              Impact (X) vs Prob (Y)
            </span>
          </div>
       </div>
       <div className="grid grid-cols-5 gap-2 h-[450px] relative">
          {/* Legend helper */}
          <div className="absolute -left-16 top-1/2 -rotate-90 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pointer-events-none">
            Probability (1-5)
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pointer-events-none">
            Impact Magnitude (1-5)
          </div>
          
          {[...Array(25)].map((_, i) => {
            const row = 4 - Math.floor(i / 5); // 4 down to 0
            const col = i % 5;                 // 0 to 4
            
            const prob = row + 1; // 5 to 1
            const impact = col + 1; // 1 to 5
            
            // Fix: correctly filter data based on axes
            const matches = data.filter(d => 
              Math.round(d.probability) === prob && 
              Math.round(d.impact) === impact
            );
            const count = matches.reduce((acc, m) => acc + m.count, 0);
            
            // Color logic for heatmap based on standard Risk Matrix (Impact * Probability)
            const score = prob * impact;
            let bgColor = 'bg-slate-800/10';
            let borderColor = 'border-white/5';
            
            if (score >= 16) {
              bgColor = 'bg-red-500/30';
              borderColor = 'border-red-500/20';
            } else if (score >= 9) {
              bgColor = 'bg-amber-500/20';
              borderColor = 'border-amber-500/20';
            } else if (score >= 4) {
              bgColor = 'bg-blue-500/10';
              borderColor = 'border-blue-500/20';
            }

            return (
              <div 
                key={i} 
                className={`${bgColor} ${borderColor} border-2 rounded-2xl flex flex-col items-center justify-center group relative overflow-visible transition-all hover:scale-[1.02] hover:z-20 hover:bg-white/5 cursor-default`}
              >
                 {count > 0 && (
                   <>
                     <div className="text-white font-black text-2xl drop-shadow-lg z-10">
                       {count}
                     </div>
                     {/* Tooltip on hover */}
                     <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 bg-[#0a0d1a] border border-white/20 p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-[100]">
                        <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Scenarios Detected</div>
                        {matches.map((m, idx) => (
                          <div key={idx} className="text-[10px] font-bold text-slate-100 leading-tight mb-2 last:mb-0">
                            • {m.label || 'Undocumented Risk'}
                          </div>
                        ))}
                        <div className="mt-2 pt-2 border-t border-white/5 flex justify-between text-[8px] font-black text-slate-500 uppercase">
                           <span>Prob: {prob}</span>
                           <span>Impact: {impact}</span>
                        </div>
                     </div>
                   </>
                 )}
                 <div className="absolute inset-0 opacity-0 group-hover:opacity-100 flex items-end justify-start p-2 pointer-events-none">
                    <span className="text-[8px] font-black text-slate-600 uppercase">P{prob} I{impact}</span>
                 </div>
              </div>
            );
          })}
       </div>
    </div>
  );
};

export const SystemStatusManifest = () => {
  const statuses = [
    { label: 'BAYESIAN MODEL', status: 'SUCCESSFUL', color: 'text-emerald-500', dotColor: 'bg-emerald-500' },
    { label: 'MONTE CARLO SIM', status: 'SUCCESSFUL', color: 'text-emerald-500', dotColor: 'bg-emerald-500' },
    { label: 'OBSERVABILITY HOOKS', status: 'GENERATED', color: 'text-blue-500', dotColor: 'bg-blue-500' },
    { label: 'RESIDUAL RISK CALC', status: 'GENERATED', color: 'text-blue-500', dotColor: 'bg-blue-500' },
    { label: 'COMPLIANCE AUDIT', status: 'WORKING', color: 'text-amber-500', dotColor: 'bg-amber-500' },
  ];

  return (
    <div className="bg-[#12162b] border border-white/5 rounded-[40px] p-10 space-y-8 mb-12 shadow-xl">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6">INTERNAL SYSTEM DIAGNOSTICS</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
        {statuses.map((s, i) => (
          <div key={i} className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-tighter">{s.label}</span>
            <span className={`text-[11px] font-black uppercase italic ${s.color} flex items-center gap-3`}>
              <div className={`w-2 h-2 rounded-full ${s.dotColor} ${s.status === 'WORKING' ? 'animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]' : ''}`} />
              {s.status}
            </span>
          </div>
        ))}
        <div className="hidden md:block border-b border-transparent pb-3" />
      </div>
    </div>
  );
};

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ metrics }) => {
  return (
    <div className="space-y-16">
      {/* 0. Internal System Diagnostics */}
      <SystemStatusManifest />

      {/* 1. Decision Readiness & Financial Impact */}
      <DecisionReadiness 
        status={metrics.decisionStatus} 
        score={metrics.readinessScore} 
        costOfInaction={metrics.costOfInaction}
      />

      {/* 2. Risk Heatmap */}
      <RiskHeatmap data={metrics.heatmap} />

      {/* 3. Hardening ROI Analysis (Scatter Plot) */}
      <div className="bg-[#12162b] border border-white/5 p-10 rounded-[40px] space-y-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4 italic text-white">
            <Target size={32} className="text-emerald-500" /> Hardening ROI Analysis
          </h3>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-[#0a0d1a] px-4 py-1.5 rounded-full border border-white/5">
            Strategic Mitigation Mapping
          </span>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
              <CartesianGrid strokeDasharray="5 5" stroke="#ffffff10" />
              <XAxis 
                type="number" 
                dataKey="cost" 
                name="Cost" 
                unit="$" 
                stroke="#475569" 
                fontSize={10} 
                fontWeight="900" 
                axisLine={false} 
                tickLine={false}
                ticks={[0, 6500, 13000, 19500, 26000]}
                label={{ value: 'Cost ($)', position: 'insideBottom', offset: -25, fill: '#475569', fontSize: 10, fontWeight: '900' }} 
              />
              <YAxis 
                type="number" 
                dataKey="riskReduction" 
                name="Risk Reduction" 
                unit="%" 
                stroke="#475569" 
                fontSize={10} 
                fontWeight="900" 
                axisLine={false} 
                tickLine={false} 
                label={{ value: 'Risk Reduction (%)', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10, fontWeight: '900' }} 
              />
              <ZAxis type="number" dataKey="size" range={[200, 1200]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '10px' }} />
              <Scatter name="Mitigations" data={metrics.riskVsCost}>
                {metrics.riskVsCost.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.riskReduction > 50 ? '#10b981' : '#3b82f6'} fillOpacity={0.7} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Risk Probabilistic Trend (Line Chart) */}
      <div className="bg-[#12162b] border border-white/5 p-10 rounded-[40px] space-y-8 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4 italic text-white">
            <TrendingDown size={32} className="text-blue-500" /> Probabilistic Risk Trend (Bayesian)
          </h3>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-[#0a0d1a] px-4 py-1.5 rounded-full border border-white/5">
            Simulation Timeline
          </span>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.riskTrend} margin={{ bottom: 30 }}>
              <CartesianGrid strokeDasharray="5 5" stroke="#ffffff08" vertical={false} />
              <XAxis 
                dataKey="month" 
                stroke="#475569" 
                fontSize={10} 
                fontWeight="900" 
                axisLine={false} 
                tickLine={false} 
                dy={15} 
                label={{ value: 'Simulation Timeline', position: 'insideBottom', offset: -15, fill: '#475569', fontSize: 10, fontWeight: '900' }}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                fontWeight="900" 
                axisLine={false} 
                tickLine={false} 
                dx={-15}
                label={{ value: 'Risk Score', angle: -90, position: 'insideLeft', fill: '#475569', fontSize: 10, fontWeight: '900' }}
              />
              <Tooltip 
                contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '10px', fontWeight: 'bold' }}
              />
              <ReferenceLine y={25} stroke="#ffffff05" strokeDasharray="3 3" />
              <ReferenceLine y={50} stroke="#ffffff10" strokeDasharray="3 3" />
              <ReferenceLine y={75} stroke="#ffffff15" strokeDasharray="3 3" />
              
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#3b82f6" 
                strokeWidth={5} 
                dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#020617' }} 
                activeDot={{ r: 8, strokeWidth: 0 }}
                name="Projected Risk"
              />
              <Line 
                type="monotone" 
                dataKey="baseline" 
                stroke="#475569" 
                strokeWidth={2} 
                strokeDasharray="5 5" 
                dot={false}
                name="Baseline Risk" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
