/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sidebar } from './components/Sidebar';
import { AnalysisPanel } from './components/AnalysisPanel';
import { Search, Bell, User } from 'lucide-react';

export default function App() {
  return (
    <div className="flex h-screen w-full bg-brand-bg select-none">
      <Sidebar />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-brand-line/10 flex items-center justify-between px-8 bg-brand-bg/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 flex-1">
            <Search className="w-4 h-4 opacity-30" />
            <input 
              type="text" 
              placeholder="Search signatures, manufacturers, or case files..." 
              className="bg-transparent border-none outline-none text-xs font-sans w-full max-w-md opacity-50 focus:opacity-100 transition-opacity"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
               <button className="relative">
                 <Bell className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity" />
                 <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-brand-bg"></span>
               </button>
            </div>
            
            <div className="w-px h-6 bg-brand-line/10"></div>
            
            <div className="flex items-center gap-3">
              <div className="text-right flex flex-col">
                <span className="text-[10px] font-display font-bold uppercase tracking-wider">Dr. Elena Ross</span>
                <span className="text-[9px] font-mono opacity-40 tracking-tighter uppercase font-bold">Chief Env. Litigator</span>
              </div>
              <div className="w-8 h-8 bg-brand-ink rounded-full flex items-center justify-center text-brand-bg">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {/* Subtle grid background pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ 
              backgroundImage: `radial-gradient(var(--color-brand-ink) 0.5px, transparent 0.5px)`, 
              backgroundSize: '24px 24px' 
          }} />
          
          <div className="relative h-full flex flex-col">
            {/* Context breadcrumb or page header */}
            <div className="px-8 pt-6 flex justify-between items-center">
              <div>
                <h2 className="text-xs font-mono opacity-30 uppercase tracking-[0.3em] mb-1 leading-none">Diagnostic Module</h2>
                <h3 className="text-2xl font-display font-black leading-none">AI Chemical Fingerprinting</h3>
              </div>
              
              <div className="flex gap-2">
                <div className="px-3 py-1 border border-brand-line/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[9px] font-mono uppercase tracking-widest font-bold">ML_ENGINE_STABLE</span>
                </div>
              </div>
            </div>

            <AnalysisPanel />
          </div>
        </div>
      </main>
    </div>
  );
}

