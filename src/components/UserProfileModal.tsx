import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Save, FileImage } from 'lucide-react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || '');
          setImageUrl(data.imageUrl || '');
        }
      } catch (error) {
        try {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        } catch (e) {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        name,
        imageUrl,
        updatedAt: serverTimestamp()
      });
      onClose();
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      } catch (e) {
        console.error(e);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-bg/80 backdrop-blur-sm shadow-xl">
      <div className="bg-brand-bg border border-brand-line w-full max-w-md shadow-2xl relative flex flex-col">
          <div className="px-6 py-4 flex items-center justify-between border-b border-brand-line overflow-hidden relative">
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
              style={{ backgroundImage: `radial-gradient(var(--color-brand-ink) 0.5px, transparent 0.5px)`, backgroundSize: '16px 16px' }} />
            <div className="relative">
              <h2 className="font-display font-medium text-lg uppercase tracking-tight">Operative Profile</h2>
              <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Clearance Level: Confirmed</p>
            </div>
            <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-brand-line/10 transition-colors z-10"
            >
                <X className="w-4 h-4 opacity-70" />
            </button>
          </div>

          <div className="p-6 flex flex-col gap-6 font-mono text-sm">
             {loading ? (
                 <div className="text-center opacity-50 text-xs py-10">Loading profile data...</div>
             ) : (
                <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Display Name</label>
                    <input
                      type="text"
                      className="w-full bg-brand-line/5 border border-brand-line px-4 py-2 text-xs outline-none focus:border-brand-ink transition-colors"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Avatar URL</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="https://..."
                            className="flex-1 bg-brand-line/5 border border-brand-line px-4 py-2 text-xs outline-none focus:border-brand-ink transition-colors"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                         {imageUrl && (
                            <img src={imageUrl} alt="Avatar" className="w-9 h-9 rounded-full border border-brand-line object-cover" />
                         )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">Email Address</label>
                    <input
                      type="text"
                      className="w-full bg-brand-line/5 border border-brand-line/50 px-4 py-2 text-xs outline-none opacity-50 cursor-not-allowed"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-4 pt-6 border-t border-brand-line/20">
                     <button
                        onClick={() => {
                            logout();
                            onClose();
                        }}
                        className="text-[10px] text-red-600 hover:text-red-700 uppercase font-bold tracking-widest border border-red-600/30 px-4 py-2 hover:bg-red-600/5 transition-colors"
                     >
                         Revoke Access
                     </button>
                    <div className="flex gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-brand-line hover:bg-brand-line/10 transition-colors uppercase text-[10px] tracking-widest font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="px-4 py-2 bg-brand-ink text-brand-bg hover:bg-brand-ink/90 transition-colors uppercase text-[10px] tracking-widest font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saving ? 'Saving...' : 'Update Data'}
                        </button>
                    </div>
                </div>
                </>
             )}
          </div>
      </div>
    </div>
  );
};
