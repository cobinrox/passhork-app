import React, { useState, useEffect } from 'react';
import { usePassword } from './hooks/usePassword';
import { 
  RefreshCw, 
  Copy, 
  CheckCircle2, 
  Settings, 
  HelpCircle, 
  Download,
  AlertCircle,
  ShieldCheck,
  Keyboard,
  Info
} from 'lucide-react';
import { clsx } from 'clsx';

function App() {
  const {
    password,
    originalPhrase,
    generating,
    progress,
    llmError,
    targetLength,
    setTargetLength,
    generate,
    initLLM,
    isReady,
    complexity,
    ergoScore,
  } = usePassword();

  const [copied, setCopied] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Generate initial password if on home screen
    if (!showOnboarding && !password && !generating) {
      generate();
    }
  }, [showOnboarding, password, generating, generate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showOnboarding) {
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
            onClick={() => setShowOnboarding(false)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform active:scale-95 text-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-md mx-auto space-y-6">
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
            <button className="p-2 text-slate-400 hover:text-slate-600"><Settings className="w-6 h-6" /></button>
          </div>
        </header>

        {/* Model Download Banner */}
        {!isReady && !generating && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-indigo-800">
                <Download className="w-5 h-5" />
                <span className="font-medium">Enable AI Generation</span>
              </div>
              <button 
                onClick={initLLM}
                disabled={generating}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Download Model
              </button>
            </div>
            <p className="text-xs text-indigo-600/80 leading-relaxed">
              Download a lightweight AI (600MB) to generate smarter passwords. Stays on your device forever.
            </p>
          </div>
        )}

        {/* Loading Progress */}
        {generating && !isReady && progress > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-slate-600">Downloading AI model...</span>
              <span className="text-indigo-600">{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300 rounded-full" 
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 text-center italic">
              Usually takes 1-2 minutes on broadband
            </p>
          </div>
        )}

        {/* Error State */}
        {llmError && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{llmError}</p>
          </div>
        )}

        {/* Password Display */}
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-white space-y-6">
          <div className="space-y-2 text-center">
            <div className="min-h-[3rem] flex items-center justify-center overflow-x-auto">
              <span className="text-3xl md:text-4xl font-mono font-bold tracking-tight text-slate-800 break-all leading-tight">
                {password || '••••••••••••••'}
              </span>
            </div>
            {originalPhrase && (
              <p className="text-slate-400 text-sm flex items-center justify-center gap-1.5">
                <Info className="w-4 h-4" />
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
              {generating ? 'Working...' : 'New'}
            </button>
          </div>
        </div>

        {/* Settings / Controls */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-slate-700">Password Length</label>
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
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
            <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
              <span>12</span>
              <span>15</span>
              <span>20</span>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ergonomics</label>
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
                <span className="text-xs font-bold text-slate-600">{ergoScore}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Complexity</label>
              <div className="flex items-center gap-1">
                {complexity.requirements.map((req, i) => (
                  <div 
                    key={i} 
                    title={req.label}
                    className={clsx(
                      "w-4 h-4 rounded-full flex items-center justify-center",
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

        {/* Recent History Placeholder */}
        <div className="px-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent phrases</h3>
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {['ToBe@Not2Be!', 'LookB4@Leap!', 'Stay+Hungry5!'].map((pw, i) => (
              <div key={i} className="bg-slate-200/50 text-slate-600 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap">
                {pw}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
