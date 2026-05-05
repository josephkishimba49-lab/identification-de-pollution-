/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ForensicAlert } from '../types';
import { generateAlertSummary } from '../services/geminiService';
import { MARKER_NAMES, MARKER_PERSISTENCE } from '../constants';

interface AlertContextType {
  alerts: ForensicAlert[];
  selectedAlertId: string | null;
  setSelectedAlertId: (id: string | null) => void;
  autoDismissDelay: number;
  setAutoDismissDelay: (delay: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  soundUrl: string;
  setSoundUrl: (url: string) => void;
  addAlert: (alert: Omit<ForensicAlert, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [autoDismissDelay, setAutoDismissDelay] = useState(30000); // Default 30s
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundUrl, setSoundUrl] = useState('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
  const [alerts, setAlerts] = useState<ForensicAlert[]>([
    {
      id: 'initial-1',
      timestamp: new Date().toISOString(),
      severity: 'critical',
      title: 'Sector 7 Discharge Anomaly',
      description: 'Abnormal concentrations of heavy metals detected in downstream sensors.',
      type: 'threshold_breach',
      isRead: false
    },
    {
      id: 'initial-2',
      timestamp: new Date().toISOString(),
      severity: 'warning',
      title: 'Minor PH Deviation',
      description: 'Sensor B-12 reporting slight alkalinity increase in canal 4.',
      type: 'threshold_breach',
      isRead: false
    },
    {
      id: 'initial-3',
      timestamp: new Date().toISOString(),
      severity: 'info',
      title: 'Calibration Success',
      description: 'Upstream biosensors recalibrated successfully.',
      type: 'system',
      isRead: false
    }
  ]);

  const addAlert = useCallback((newAlert: Omit<ForensicAlert, 'id' | 'timestamp' | 'isRead'>) => {
    const alert: ForensicAlert = {
      ...newAlert,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    if (alert.severity === 'critical' && soundEnabled && soundUrl) {
      const audio = new Audio(soundUrl);
      audio.volume = 0.5;
      audio.play().catch(e => console.warn('Audio playback failed:', e));
    }

    setAlerts(prev => [alert, ...prev]);

    // Async AI Summary Generation for critical alerts
    if (alert.severity === 'critical') {
      const markerName = alert.metadata?.symbol ? MARKER_NAMES[alert.metadata.symbol] : undefined;
      const persistenceData = alert.metadata?.symbol ? MARKER_PERSISTENCE[alert.metadata.symbol] : undefined;
      generateAlertSummary(alert.title, alert.description, alert.metadata?.attributionSource, markerName, persistenceData).then(summary => {
        setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, aiSummary: summary } : a));
      });
    }
  }, [soundEnabled, soundUrl]);

  const markAsRead = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setSelectedAlertId(currentId => currentId === id ? null : currentId);
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setSelectedAlertId(null);
  }, []);

  // Handle AI summary generation for selected critical alerts if missing
  useEffect(() => {
    if (selectedAlertId) {
      const alert = alerts.find(a => a.id === selectedAlertId);
      if (alert && alert.severity === 'critical' && !alert.aiSummary) {
        const markerName = alert.metadata?.symbol ? MARKER_NAMES[alert.metadata.symbol] : undefined;
        const persistenceData = alert.metadata?.symbol ? MARKER_PERSISTENCE[alert.metadata.symbol] : undefined;
        generateAlertSummary(alert.title, alert.description, alert.metadata?.attributionSource, markerName, persistenceData).then(summary => {
          setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, aiSummary: summary } : a));
        });
      }
    }
  }, [selectedAlertId, alerts]);

  // Automatic dismissal with granular delays based on severity
  useEffect(() => {
    const timers = alerts
      .filter(a => a.severity !== 'critical')
      .map(alert => {
        const timeElapsed = Date.now() - new Date(alert.timestamp).getTime();
        
        // Define delays (ms): high=15s, medium=30s, low=45s, info=60s
        const dismissDelays: Record<string, number> = {
          high: 15000,
          warning: 20000,
          medium: 30000,
          low: 45000,
          info: 60000
        };
        
        const delay = dismissDelays[alert.severity] || autoDismissDelay;
        const timeLeft = Math.max(0, delay - timeElapsed);
        
        return setTimeout(() => {
          removeAlert(alert.id);
        }, timeLeft);
      });

    return () => timers.forEach(t => clearTimeout(t));
  }, [alerts, removeAlert, autoDismissDelay]);

  // Simulate incoming real-time alerts if needed
  useEffect(() => {
    const timer = setTimeout(() => {
      // Periodic check or simulated event
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AlertContext.Provider value={{ 
      alerts, 
      selectedAlertId,
      setSelectedAlertId,
      autoDismissDelay, 
      setAutoDismissDelay, 
      soundEnabled,
      setSoundEnabled,
      soundUrl,
      setSoundUrl,
      addAlert, 
      markAsRead, 
      removeAlert, 
      clearAlerts 
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};
