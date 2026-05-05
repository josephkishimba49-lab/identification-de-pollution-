/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertCircle, X, Bell, Info, ShieldAlert, Filter, Volume2, TrendingUp } from 'lucide-react';
import { useAlerts } from '../contexts/AlertContext';
import { ForensicAlert } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { SidebarAlertSparkline } from './SidebarAlertSparkline';
import { XAIExplanationComponent } from './XAIExplanationComponent';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, CartesianGrid } from 'recharts';

// Helper to generate consistent mock 7-day data for Sidebar
const GET_SIDEBAR_HISTORICAL = (symbol: string) => {
  const data = [];
  const seed = symbol.charCodeAt(0) + (symbol.charCodeAt(symbol.length - 1) || 0);
  for (let i = 7; i >= 0; i--) {
    data.push({
      day: i === 0 ? 'NOW' : `-${i}D`,
      value: Math.floor(Math.sin((i + seed) * 0.6) * 15 + 40 + Math.random() * 8)
    });
  }
  return data;
};

export const AlertBanner: React.FC = () => {
  const { alerts, removeAlert } = useAlerts();
  const activeAlerts = alerts.filter(a => !a.isRead && a.severity === 'critical');

  if (activeAlerts.length === 0) return null;

  const latestAlert = activeAlerts[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[100] px-4 py-2"
      >
        <div className="max-w-4xl mx-auto bg-red-600 dark:bg-red-900 text-white shadow-lg border border-red-500/50 flex items-center justify-between p-3 rounded-none md:rounded-b-lg">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 shrink-0 animate-pulse" />
            <div>
              <span className="font-display font-black uppercase text-[10px] tracking-widest block leading-none mb-1">
                Critical System Alert
              </span>
              <p className="text-xs font-serif italic">
                {latestAlert.title}: {latestAlert.description}
              </p>
            </div>
          </div>
          <button 
            onClick={() => removeAlert(latestAlert.id)}
            className="p-1 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const SidebarAlertList: React.FC = () => {
  const { 
    alerts, 
    removeAlert, 
    markAsRead, 
    selectedAlertId,
    setSelectedAlertId,
    autoDismissDelay, 
    setAutoDismissDelay,
    soundEnabled,
    setSoundEnabled,
    soundUrl,
    setSoundUrl
  } = useAlerts();
  const [isSoundSettingsOpen, setIsSoundSettingsOpen] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'signature_match' | 'threshold_breach' | 'system'>('all');

  const filteredAlerts = alerts.filter(alert => {
    const severityMatch = severityFilter === 'all' || alert.severity === severityFilter;
    const typeMatch = typeFilter === 'all' || alert.type === typeFilter;
    return severityMatch && typeMatch;
  });

  // Group alerts by title, type, and date only (removing time to allow better grouping)
  const groupedAlerts = filteredAlerts.reduce((acc, alert) => {
    const d = new Date(alert.timestamp);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const key = `${alert.title}-${alert.type}-${dateKey}`;
    
    if (!acc[key]) {
      acc[key] = { 
        ...alert, 
        count: 1, 
        ids: [alert.id], 
        dateDisplay: dateKey,
        timeDisplay: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        allRead: alert.isRead 
      };
    } else {
      acc[key].count += 1;
      acc[key].ids.push(alert.id);
      acc[key].timestamp = alert.timestamp; // Use latest timestamp
      acc[key].allRead = acc[key].allRead && alert.isRead;
    }
    return acc;
  }, {} as Record<string, ForensicAlert & { count: number; ids: string[]; dateDisplay: string; timeDisplay: string; allRead: boolean }>);

  const displayGroups = Object.values(groupedAlerts).slice(0, 4) as (ForensicAlert & {
    count: number;
    ids: string[];
    dateDisplay: string;
    timeDisplay: string;
    allRead: boolean;
  })[];

  const handleRemoveGroup = (ids: string[]) => {
    ids.forEach(id => {
      removeAlert(id);
      if (id === selectedAlertId) {
        setSelectedAlertId(null);
      }
    });
  };

  const handleMarkGroupRead = (ids: string[]) => {
    ids.forEach(id => markAsRead(id));
    if (ids.length > 0) {
      setSelectedAlertId(ids[0]);
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Filters */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1 px-1">
          <Filter className="w-3 h-3 opacity-30" />
          <span className="text-[9px] font-mono uppercase tracking-tighter opacity-40 font-bold">Filters</span>
        </div>
        
        <div className="flex flex-wrap gap-1">
          {['all', 'critical', 'warning', 'info'].map((s) => (
            <button
              key={s}
              onClick={() => setSeverityFilter(s as any)}
              className={`
                px-2 py-0.5 text-[8px] font-display font-bold uppercase tracking-widest border
                ${severityFilter === s 
                  ? 'bg-brand-ink text-brand-bg border-brand-ink' 
                  : 'bg-transparent text-brand-ink/40 border-brand-line/10 hover:border-brand-line/30'}
              `}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1">
          {['all', 'signature_match', 'threshold_breach'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t as any)}
              className={`
                px-2 py-0.5 text-[8px] font-display font-bold uppercase tracking-widest border
                ${typeFilter === t
                  ? 'bg-brand-ink text-brand-bg border-brand-ink'
                  : 'bg-transparent text-brand-ink/40 border-brand-line/10 hover:border-brand-line/30'}
              `}
            >
              {t.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1 mt-1">
          <span className="text-[7px] font-mono uppercase opacity-30 w-full mb-1">Persistence (s)</span>
          {[10, 30, 60].map((d) => (
            <button
              key={d}
              onClick={() => setAutoDismissDelay(d * 1000)}
              className={`
                px-2 py-0.5 text-[8px] font-mono font-bold border
                ${autoDismissDelay === d * 1000
                  ? 'bg-brand-ink text-brand-bg border-brand-ink'
                  : 'bg-transparent text-brand-ink/40 border-brand-line/10 hover:border-brand-line/30'}
              `}
            >
              {d === 10 ? 'FLASH' : d === 30 ? 'STD' : 'EXT'} {d}s
            </button>
          ))}
        </div>

        {/* Sound Settings */}
        <div className="mt-2 pt-2 border-t border-brand-line/10">
          <button 
            onClick={() => setIsSoundSettingsOpen(!isSoundSettingsOpen)}
            className="flex items-center justify-between w-full text-[9px] font-mono uppercase opacity-40 hover:opacity-100 transition-opacity"
          >
            <div className="flex items-center gap-1">
              <Volume2 className="w-3 h-3" />
              <span>Audio Diagnostic</span>
            </div>
            <span>{isSoundSettingsOpen ? '[-]' : '[+]'}</span>
          </button>
          
          {isSoundSettingsOpen && (
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono opacity-50 uppercase">Master Enable</span>
                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-8 h-4 rounded-full p-0.5 transition-colors ${soundEnabled ? 'bg-brand-ink' : 'bg-brand-line/20'}`}
                >
                  <div className={`w-3 h-3 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-mono opacity-50 uppercase">Critical Preset</span>
                <div className="flex gap-1">
                  {[
                    { name: 'BEEP', url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3' },
                    { name: 'PULSE', url: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3' },
                    { name: 'RADAR', url: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3' }
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        setSoundUrl(p.url);
                        const audio = new Audio(p.url);
                        audio.volume = 0.3;
                        audio.play();
                      }}
                      className={`flex-1 py-1 text-[7px] font-mono border ${soundUrl === p.url ? 'bg-brand-ink text-brand-bg border-brand-ink' : 'border-brand-line/10 opacity-60'}`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
      <AnimatePresence initial={false}>
        {displayGroups.map((group) => (
          <motion.div
            key={`${group.title}-${group.type}-${group.dateDisplay}-${group.timeDisplay}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => handleMarkGroupRead(group.ids)}
            className={`
              flex items-center gap-3 p-3 border leading-tight relative group cursor-pointer transition-all
              ${selectedAlertId && group.ids.includes(selectedAlertId) ? 'ring-2 ring-brand-ink ring-inset scale-[1.02]' : ''}
              ${group.allRead ? 'opacity-40 grayscale-[0.5]' : 'opacity-100'}
              ${group.severity === 'critical' ? 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100' : 
                group.severity === 'warning' ? 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' :
                'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100'}
            `}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <div className="flex-1">
              <div className="text-[7px] font-mono opacity-30 uppercase mb-0.5">
                {group.dateDisplay}
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-display font-bold uppercase tracking-tight">
                    {group.title}
                  </div>
                  {group.count > 1 && (
                    <span className="text-[9px] bg-brand-ink text-brand-bg px-1 rounded-sm font-mono font-bold">
                      ×{group.count}
                    </span>
                  )}
                </div>
                {group.metadata?.symbol && (
                  <SidebarAlertSparkline 
                    symbol={group.metadata.symbol} 
                    color={
                      group.severity === 'critical' ? '#dc2626' : 
                      group.severity === 'warning' ? '#d97706' : 
                      '#2563eb'
                    }
                  />
                )}
              </div>
              <div className="text-[9px] font-serif italic line-clamp-1 opacity-80">
                {group.description}
              </div>
              
              {/* Enhanced Diagnostic Stats */}
              {group.metadata?.symbol && (
                <div className="mt-2 pt-2 border-t border-current/10 grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-mono uppercase opacity-40">Avg Concentration</span>
                    <span className="text-[10px] font-mono font-bold">{group.metadata.concentration} mg/L</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] font-mono uppercase opacity-40">Limit Threshold</span>
                    <span className="text-[10px] font-mono font-bold opacity-60">{group.metadata.threshold} mg/L</span>
                  </div>
                </div>
              )}

              {/* 7-Day Trend Visualization */}
              {group.metadata?.symbol && group.ids.includes(selectedAlertId || '') && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-3 overflow-hidden border-t border-current/10 pt-2"
                >
                  <div className="flex items-center gap-1 mb-2">
                    <TrendingUp className="w-2.5 h-2.5 opacity-40" />
                    <span className="text-[8px] font-mono uppercase opacity-40">7-Day Baseline Velocity</span>
                  </div>
                  <div className="h-16 w-full opacity-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={GET_SIDEBAR_HISTORICAL(group.metadata.symbol)}>
                        <CartesianGrid strokeDasharray="2 2" stroke="currentColor" opacity={0.1} vertical={false} />
                        <XAxis 
                          dataKey="day" 
                          hide={false} 
                          tick={{ fill: 'currentColor', fontSize: 6, fontFamily: 'monospace' }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="currentColor"
                          strokeWidth={1}
                          dot={{ r: 1 }}
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>
              )}

              {group.ids.includes(selectedAlertId || '') && (
                <div className="mt-3">
                  <XAIExplanationComponent explanation={{
                    threatClassification: group.type.replace('_', ' '),
                    forensicProbability: group.metadata?.concentration && group.metadata?.threshold 
                      ? Math.min(1.0, group.metadata.concentration / group.metadata.threshold) 
                      : 0.85,
                    predictiveInsight: group.aiSummary?.issue || "AI analysis indicates significant deviation from baseline norms.",
                    preemptiveActions: group.aiSummary?.recommendations || [],
                    keyFeatures: group.metadata?.keyFeatures || []
                  }} />
                </div>
              )}

              <div className="text-[8px] font-mono opacity-40 mt-1 uppercase">
                {group.timeDisplay}
              </div>
            </div>
            
            {/* Decay Progress Bar for non-critical alerts */}
            {group.severity !== 'critical' && (
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-current opacity-10">
                <motion.div 
                  initial={{ width: '100%' }}
                  animate={{ width: 0 }}
                  transition={{ duration: autoDismissDelay / 1000, ease: 'linear' }}
                  className="h-full bg-current"
                />
              </div>
            )}
            
            <button 
              onClick={(e) => { e.stopPropagation(); handleRemoveGroup(group.ids); }}
              className="opacity-20 hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {filteredAlerts.length === 0 && (
        <div className="text-[10px] font-serif italic opacity-30 text-center py-4 border border-dashed border-brand-line/20">
          No matches for current filters.
        </div>
      )}
      </div>
    </div>
  );
};
