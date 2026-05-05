import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogle, loading } = useAuth();

  return (
    <div className="flex h-screen w-full bg-brand-bg items-center justify-center p-4">
        {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: `radial-gradient(var(--color-brand-ink) 0.5px, transparent 0.5px)`, 
            backgroundSize: '24px 24px' 
        }} />

        <div className="relative max-w-md w-full border border-brand-line/20 bg-brand-bg/80 backdrop-blur-md p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-brand-line/10 rounded-full flex items-center justify-center mb-6">
                <ShieldAlert className="w-8 h-8 text-brand-ink opacity-80" />
            </div>
            
            <h1 className="text-2xl font-display font-black mb-2 uppercase tracking-tight">Access Restricted</h1>
            <p className="text-xs font-mono opacity-50 mb-8 max-w-xs">
                Authentication required to access the diagnostic module and chemical fingerprinting data.
            </p>

            <button
                onClick={loginWithGoogle}
                disabled={loading}
                className="w-full bg-brand-ink text-brand-bg hover:bg-brand-ink/90 px-6 py-4 flex items-center justify-center gap-3 transition-colors font-mono text-xs uppercase tracking-widest font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                <span>Sign In with Google</span>
            </button>
            
            <div className="mt-8 pt-8 border-t border-brand-line/10 w-full flex items-center justify-between text-[10px] font-mono opacity-40 uppercase tracking-widest font-bold">
                <span>Enterprise Edition</span>
                <span>SEC-LEVEL: RED</span>
            </div>
        </div>
    </div>
  );
};
