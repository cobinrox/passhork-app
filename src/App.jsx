import React, { useState, useEffect } from 'react';
import { usePassword } from './hooks/usePassword';
import { 
  RefreshCw, 
  Copy, 
  CheckCircle2, 
  Settings as SettingsIcon, 
  HelpCircle, 
  Download,
  AlertCircle,
  ShieldCheck,
  Keyboard,
  Info,
  Bot,
  Package
} from 'lucide-react';
import { clsx } from 'clsx';
import { Settings } from './components/Settings';
import { ModeToggle } from './components/ModeToggle';
import { InstallPrompt } from './components/InstallPrompt';

function App() {
  const {
    password,
    originalPhrase,
    generating,
    progress,
    llmError,
    targetLength,
    setTargetLength,
    useAIPreference,
    setUseAIPreference,
    generate,
    initLLM,
    isReady,
    activeModelId,
    installedModels,
    clearCache,
    complexity,
    ergoScore,
  } = usePassword();

  const [copied, setCopied] = useState(false);
  const [view, setView] = useState('onboarding'); // 'onboarding', 'app', 'settings'
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('passhork_history') || '[]');
  });

  useEffect(() => {
    // Check if we should skip onboarding
    const hasSeenOnboarding = localStorage.getItem('passhork_onboarding_seen');
    if (hasSeenOnboarding) {
      setView('app');
    }
  }, []);

  useEffect(() => {
    // Generate initial password if in app view
    if (view === 'app' && !password && !generating) {
      generate();
    }
  }, [view, password, generating, generate]);

  useEffect(() => {
    if (password && !generating) {
      setHistory(prev => {
        const newHistory = [password, ...prev.filter(p => p !== password)].slice(0, 10);
        localStorage.setItem('passhork_history', JSON.stringify(newHistory));
        return newHistory;
      });
    }
  }, [password, generating]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const finishOnboarding = () => {
    localStorage.setItem('passhork_onboarding_seen', 'true');
    setView('app');
  };

  if (view === 'onboarding') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Passhork</h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Memorable passwords from your favorite quotes, powered by private AI on your phone.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold">100% Private</h3>
                <p className="text-slate-500 text-sm">AI runs entirely on your device. No data leaves your phone.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 mt-1">
                <Keyboard className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold">Easy to Type</h3>
                <p className="text-slate-500 text-sm">Optimized for QWERTY keyboard flow and hand alternation.</p>
              </div>
            </div>
          </div>

          <button
            onClick={finishOnboarding}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 text-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  if (view === 'settings') {
    return (
      <Settings 
        onBack={() => setView('app')}
        activeModelId={activeModelId}
        installedModels={installedModels}
        onSelectModel={initLLM}
        loading={generating && !isReady} // Using generating state during init
        progress={progress}
        error={llmError}
        onClearCache={clearCache}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-6 pb-20">
        {/* Header */}
        <header className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Passhork</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600"><HelpCircle className="w-6 h-6" /></button>
            <button onClick={() => setView('settings')} className="p-2 text-slate-400 hover:text-slate-600"><SettingsIcon className="w-6 h-6" /></button>
          </div>
        </header>

        {/* Model Download Banner (Simplified) */}
        {!isReady && useAIPreference && !generating && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-indigo-800">
                <Download className="w-5 h-5" />
                <span className="font-medium text-sm">Download AI Model</span>
              </div>
              <button 
                onClick={() => initLLM()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Download
              </button>
            </div>
            <p className="text-[10px] text-indigo-600/80 leading-relaxed">
              You've selected "Use AI" mode. Please download a model to continue, or switch to "Internal Mode".
            </p>
          </div>
        )}

        {/* Loading Progress */}
        {generating && !isReady && progress > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-600 text-xs">Downloading AI model...</span>
              <span className="text-indigo-600 text-xs font-bold">{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300 rounded-full" 
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Mode Toggle */}
        <ModeToggle 
          useAI={useAIPreference} 
          setUseAI={setUseAIPreference} 
          isAIReady={isReady} 
        />

        {/* Password Display */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white space-y-6">
          <div className="space-y-2 text-center">
            <div className="min-h-[3rem] flex items-center justify-center overflow-x-auto">
              <span className="text-3xl md:text-4xl font-mono font-bold tracking-tight text-slate-800 break-all leading-tight">
                {password || '••••••••••••••'}
              </span>
            </div>
            {originalPhrase && (
              <p className="text-slate-400 text-xs flex items-center justify-center gap-1.5">
                <Info className="w-3.5 h-4" />
                From: "{originalPhrase}"
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              disabled={!password}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-md active:scale-95",
                copied ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={() => generate()}
              disabled={generating}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 py-4 rounded-2xl font-bold shadow-indigo-200 shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={clsx("w-5 h-5", generating && "animate-spin")} />
              {generating ? (isReady ? 'Thinking...' : 'Loading AI...') : 'New'}
            </button>
          </div>
        </div>

        {/* Settings / Controls */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-700 text-sm">Password Length</label>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                {targetLength} chars
              </span>
            </div>
            <input 
              type="range" 
              min="12" 
              max="20" 
              value={targetLength}
              onChange={(e) => setTargetLength(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1">
              <span>12</span>
              <span>15</span>
              <span>20</span>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ergonomics</label>
              <div className="flex items-end gap-2">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={clsx(
                      "h-full rounded-full transition-all duration-1000",
                      ergoScore > 75 ? "bg-emerald-500" : ergoScore > 50 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${ergoScore}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-slate-600">{ergoScore}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complexity</label>
              <div className="flex items-center gap-1">
                {complexity.requirements.map((req, i) => (
                  <div 
                    key={i} 
                    title={req.label}
                    className={clsx(
                      "w-3.5 h-3.5 rounded-full flex items-center justify-center",
                      req.met ? "text-emerald-500" : "text-slate-200"
                    )}
                  >
                    <CheckCircle2 className="w-full h-full" strokeWidth={3} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic History */}
        {history.length > 0 && (
          <div className="px-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Passwords</h3>
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {history.map((pw, i) => (
                <button 
                  key={i} 
                  onClick={() => {
                    navigator.clipboard.writeText(pw);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="bg-white border border-slate-100 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shadow-sm active:scale-95 transition-transform"
                >
                  {pw}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="flex justify-center items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
           <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Private</span>
           <span className="flex items-center gap-1"><Package className="w-3 h-3" /> Offline</span>
        </div>
      </div>
      <InstallPrompt />
    </div>
  );
}

export default App;
