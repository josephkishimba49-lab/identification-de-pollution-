/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sidebar } from './components/Sidebar';
import { AnalysisPanel } from './components/AnalysisPanel';
import { AlertBanner } from './components/Alerts';
import { AlertProvider, useAlerts } from './contexts/AlertContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { UserProfileModal } from './components/UserProfileModal';
import { Search, Bell, User, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './lib/firebase';

import { UnmixingSimulation } from './components/UnmixingSimulation';
import { SiameseComparison } from './components/SiameseComparison';
import { TraceabilityLog } from './components/TraceabilityLog';
import { DisasterRecovery } from './components/DisasterRecovery';
import { ShazamModule } from './components/ShazamModule';
import { SatFinderModule } from './components/SatFinderModule';
import { SensorFleetModule } from './components/SensorFleetModule';
import { DataValidationModule } from './components/DataValidationModule';
import { PredictiveModelingModule } from './components/PredictiveModelingModule';
import { IncidentResponseModule } from './components/IncidentResponseModule';
import { ComplianceReportingModule } from './components/ComplianceReportingModule';
import { GeolocationTrackingModule } from './components/GeolocationTrackingModule';

const AppContent = () => {
  const { alerts } = useAlerts();
  const { user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem('last_active_view') || 'analyzer';
  });

  useEffect(() => {
    localStorage.setItem('last_active_view', activeView);
  }, [activeView]);

  const unreadCount = alerts.filter(a => !a.isRead).length;
  const [userName, setUserName] = useState('Unknown User');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserName(docSnap.data().name || user.displayName || 'Unknown User');
          setAvatarUrl(docSnap.data().imageUrl || user.photoURL || '');
        }
      } catch (error) {
        // Just fail silently for the header name if it errors
        console.error('Failed to load user profile for header', error);
      }
    };
    fetchProfile();
  }, [user, profileOpen]); // Reload on profile modal close

  return (
    <div className="flex h-screen w-full bg-brand-bg select-none">
      <AlertBanner />
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      
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
                 {unreadCount > 0 && (
                   <span className="absolute -top-1 -right-1 min-w-[12px] h-3 px-0.5 bg-red-600 text-[8px] font-bold text-white flex items-center justify-center rounded-full border border-brand-bg">
                     {unreadCount}
                   </span>
                 )}
               </button>
            </div>
            
            <div className="w-px h-6 bg-brand-line/10"></div>
            
            <button
               onClick={() => setProfileOpen(true)}
               className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-display font-bold uppercase tracking-wider">{userName}</span>
                <span className="text-[9px] font-mono opacity-40 tracking-tighter uppercase font-bold text-right">Operative</span>
              </div>
              <div className="w-8 h-8 bg-brand-ink rounded-full flex items-center justify-center text-brand-bg overflow-hidden border border-brand-line/20">
                {avatarUrl ? (
                   <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                   <User className="w-5 h-5" />
                )}
              </div>
            </button>
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
                <h3 className="text-2xl font-display font-black leading-none">
                  {activeView === 'analyzer' && "AI Chemical Fingerprinting"}
                  {activeView === 'shazam' && "Multi-Modal Analysis (Advanced Shazam)"}
                  {activeView === 'predictive' && "Omni-Modal Predictive Engine"}
                  {activeView === 'satfinder' && "Satellite Telemetry Array"}
                  {activeView === 'unmixing' && "Unmixing Simulation"}
                  {activeView === 'siamese' && "Siamese Network Comparison"}
                  {activeView === 'sensors' && "IoT Sensor Fleet Management"}
                  {activeView === 'geolocation' && "Geolocation Tracking Command"}
                  {activeView === 'validation' && "Data Validation QA/QC"}
                  {activeView === 'incidents' && "Active Incident Dispatch"}
                  {activeView === 'compliance' && "Regulatory & Compliance Hub"}
                  {activeView === 'reports' && "Blockchain Traceability Log"}
                  {activeView === 'settings' && "System Config & Disaster Recovery"}
                </h3>
              </div>
              
              <div className="flex gap-2">
                <div className="px-3 py-1 border border-brand-line/20 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[9px] font-mono uppercase tracking-widest font-bold">ML_ENGINE_STABLE</span>
                </div>
              </div>
            </div>

            {activeView === 'analyzer' && <AnalysisPanel />}
            {activeView === 'shazam' && <ShazamModule />}
            {activeView === 'predictive' && <PredictiveModelingModule />}
            {activeView === 'satfinder' && <SatFinderModule />}
            {activeView === 'unmixing' && <UnmixingSimulation />}
            {activeView === 'siamese' && <SiameseComparison />}
            {activeView === 'sensors' && <SensorFleetModule />}
            {activeView === 'geolocation' && <GeolocationTrackingModule />}
            {activeView === 'validation' && <DataValidationModule />}
            {activeView === 'incidents' && <IncidentResponseModule />}
            {activeView === 'compliance' && <ComplianceReportingModule />}
            {activeView === 'reports' && <TraceabilityLog />}
            {activeView === 'settings' && <DisasterRecovery />}
          </div>
        </div>
      </main>

      {profileOpen && <UserProfileModal onClose={() => setProfileOpen(false)} />}
    </div>
  );
};

const AuthWrapper = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
     return (
        <div className="h-screen w-full flex items-center justify-center bg-brand-bg">
            <Loader2 className="w-8 h-8 animate-spin opacity-50" />
        </div>
     );
  }

  if (!user) {
      return <LoginScreen />;
  }

  return <AppContent />;
};

export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <AuthWrapper />
      </AlertProvider>
    </AuthProvider>
  );
}
