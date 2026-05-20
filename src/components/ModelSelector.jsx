import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, Download, AlertCircle, Loader2 } from 'lucide-react';
import { MODELS } from '../hooks/useLLM';

export const ModelSelector = ({ 
  activeModelId, 
  installedModels, 
  onSelect, 
  loading, 
  progress,
  error 
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Available AI Models</h3>
      </div>
      
      <div className="space-y-2">
        {MODELS.map((model) => {
          const isInstalled = installedModels.includes(model.id);
          const isActive = activeModelId === model.id;
          const isDownloading = loading && activeModelId === model.id;

          return (
            <button
              key={model.id}
              onClick={() => !isDownloading && onSelect(model.id)}
              disabled={isDownloading}
              className={clsx(
                "w-full flex flex-col p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden",
                isActive ? "border-indigo-600 bg-indigo-50" : "border-slate-100 bg-white hover:border-slate-200",
                isDownloading && "cursor-wait"
              )}
            >
              <div className="flex items-start justify-between w-full relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={clsx("font-bold", isActive ? "text-indigo-900" : "text-slate-700")}>
                      {model.name}
                    </span>
                    {model.recommended && (
                      <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{model.description}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  {isInstalled ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isDownloading ? (
                    <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  ) : (
                    <Download className="w-5 h-5 text-slate-300" />
                  )}
                </div>
              </div>

              {isDownloading && (
                <div className="absolute bottom-0 left-0 h-1 bg-indigo-600 transition-all duration-300" style={{ width: `${progress * 100}%` }} />
              )}
              
              {isActive && !isInstalled && !isDownloading && !error && (
                <p className="mt-2 text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                  <Download className="w-3 h-3" /> Tap to download and activate
                </p>
              )}
              
              {isActive && error && (
                <p className="mt-2 text-[10px] font-bold text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {error}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
