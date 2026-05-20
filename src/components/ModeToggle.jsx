import React from 'react';
import { clsx } from 'clsx';
import { Bot, Package } from 'lucide-react';

export const ModeToggle = ({ useAI, setUseAI, isAIReady }) => {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 space-y-3">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Generation Mode</label>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => isAIReady && setUseAI(true)}
          disabled={!isAIReady}
          className={clsx(
            "flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left",
            useAI && isAIReady ? "border-indigo-600 bg-indigo-50" : "border-transparent bg-slate-50",
            !isAIReady && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex items-center gap-3">
            <Bot className={clsx("w-5 h-5", useAI && isAIReady ? "text-indigo-600" : "text-slate-400")} />
            <div>
              <p className={clsx("font-bold text-sm", useAI && isAIReady ? "text-indigo-900" : "text-slate-600")}>Use AI</p>
              {!isAIReady && <p className="text-[10px] text-slate-400 font-medium">Download a model in Settings</p>}
            </div>
          </div>
          <div className={clsx(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
            useAI && isAIReady ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
          )}>
            {useAI && isAIReady && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
        </button>

        <button
          onClick={() => setUseAI(false)}
          className={clsx(
            "flex items-center justify-between p-3 rounded-2xl border-2 transition-all text-left",
            !useAI || !isAIReady ? "border-indigo-600 bg-indigo-50" : "border-transparent bg-slate-50"
          )}
        >
          <div className="flex items-center gap-3">
            <Package className={clsx("w-5 h-5", !useAI || !isAIReady ? "text-indigo-600" : "text-slate-400")} />
            <div>
              <p className={clsx("font-bold text-sm", !useAI || !isAIReady ? "text-indigo-900" : "text-slate-600")}>Internal Mode</p>
              <p className="text-[10px] text-slate-400 font-medium">Fast, 100% offline</p>
            </div>
          </div>
          <div className={clsx(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
            !useAI || !isAIReady ? "border-indigo-600 bg-indigo-600" : "border-slate-300"
          )}>
            {(!useAI || !isAIReady) && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
        </button>
      </div>
    </div>
  );
};
