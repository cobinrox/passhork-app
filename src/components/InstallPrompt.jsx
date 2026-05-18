import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    });

    window.addEventListener('appinstalled', () => {
      setShow(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-40 animate-in slide-in-from-bottom-10 duration-500">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-2xl border border-primary/20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Download className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Install Passhork</p>
            <p className="text-xs text-gray-500">Add to home screen for quick access</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleInstall}
            className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg"
          >
            Install
          </button>
          <button 
            onClick={() => setShow(false)}
            className="p-2 text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
