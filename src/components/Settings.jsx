import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, ShieldCheck, Database, Info, HardDrive } from 'lucide-react';
import { ModelSelector } from './ModelSelector';

export const Settings = ({ 
  onBack, 
  activeModelId, 
  installedModels, 
  onSelectModel, 
  loading, 
  loadingPhase,
  progress, 
  error,
  onClearCache 
}) => {
  const [storageUsage, setStorageUsage] = useState(null);

  const refreshStorage = () => {
    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(estimate => {
        setStorageUsage(estimate.usage);
      });
    }
  };

  useEffect(() => {
    refreshStorage();
  }, []);

  const handleClearCache = async () => {
    const success = await onClearCache();
    if (success) {
      refreshStorage();
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <header className="bg-white border-b border-slate-100 p-4 flex items-center gap-4 sticky top-0 z-20">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 max-w-md mx-auto w-full">
        {/* AI Model Management */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="font-bold uppercase tracking-widest text-xs">AI Model</h2>
          </div>
          
          <ModelSelector 
            activeModelId={activeModelId}
            installedModels={installedModels}
            onSelect={onSelectModel}
            loading={loading}
            loadingPhase={loadingPhase}
            progress={progress}
            error={error}
          />
        </section>

        {/* Storage Info */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <Database className="w-5 h-5" />
            <h2 className="font-bold uppercase tracking-widest text-xs">Storage</h2>
          </div>
          
          <div className="bg-white rounded-3xl p-5 border border-slate-100 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Model Location</p>
                <p className="text-xs text-slate-500">Browser Cache (WebLLM)</p>
              </div>
              {storageUsage !== null && (
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Used</p>
                  <p className="text-sm font-bold text-indigo-600">{formatSize(storageUsage)}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-500 leading-relaxed">
                As a PWA, absolute paths are restricted. Your data is stored securely in your browser's isolated cache and never leaves this device.
              </p>
            </div>

            <button 
              onClick={handleClearCache}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-red-500 font-bold text-sm bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Model Cache
            </button>
          </div>
        </section>

        {/* About */}
        <section className="pt-4 border-t border-slate-200">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Version 2.5.3</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-indigo-600">Privacy</a>
              <a href="#" className="hover:text-indigo-600">Help</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
