import { useState, useEffect, useCallback, useRef } from 'react';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

// Suppress known benign warnings in production
env.suppressWarnings = [
  'Using browser cache',
  'No WebGPU adapter found'
];

export const MODELS = [
  { id: 'Xenova/phi-3-mini-4k-instruct-q4f16', name: 'Phi-3-mini', description: 'Best quality, 2.3 GB', size: '2.3 GB', recommended: true },
  { id: 'Xenova/TinyLlama-1.1B-Chat-v1.0', name: 'TinyLlama', description: 'Quick generations, 1.1 GB', size: '1.1 GB' },
  { id: 'Xenova/Qwen2-0.5B-Instruct', name: 'Qwen2-0.5B', description: 'Supports multiple languages, 1.0 GB', size: '1.0 GB' },
  { id: 'Xenova/gemma-2b-it', name: 'Gemma-2B', description: "Google's safety training, 1.5 GB", size: '1.5 GB' }
];

export const useLLM = () => {
  const [generator, setGenerator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(null); // 'checking', 'loading_storage', 'downloading'
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [activeModelId, setActiveModelId] = useState(() => {
    return localStorage.getItem('passhork_model_id') || MODELS[0].id;
  });
  const [installedModels, setInstalledModels] = useState([]);
  const [isCached, setIsCached] = useState(false);

  // Check which models are installed (localStorage tracking)
  const checkInstalledModels = useCallback(async () => {
    const saved = JSON.parse(localStorage.getItem('passhork_installed_models') || '[]');
    setInstalledModels(saved);
  }, []);

  // Check if current model is in cache
  const checkIsCached = useCallback(async (modelId = activeModelId) => {
    if (!('caches' in window)) return false;
    try {
      const cache = await caches.open('transformers-cache');
      const keys = await cache.keys();
      // We check if there are any keys related to the modelId
      const modelCached = keys.some(key => key.url.includes(modelId));
      setIsCached(modelCached);
      return modelCached;
    } catch (e) {
      console.warn('Cache check failed:', e);
      return false;
    }
  }, [activeModelId]);

  useEffect(() => {
    checkInstalledModels();
    checkIsCached();
  }, [checkInstalledModels, checkIsCached]);

  const initLLM = useCallback(async (modelId = activeModelId) => {
    setActiveModelId(modelId); // Set immediately so UI shows progress on the correct model
    setLoading(true);
    setError(null);
    setProgress(0);
    
    setLoadingPhase('checking');
    const cached = await checkIsCached(modelId);
    setLoadingPhase(cached ? 'loading_storage' : 'downloading');

    const maxRetries = 3;
    let success = false;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const device = attempt === 0 ? 'webgpu' : 'wasm'; // Try WebGPU first, then fallback to WASM
        console.log(`Initializing LLM with ${device} (attempt ${attempt + 1})...`);
        
        const pipe = await pipeline('text-generation', modelId, {
          device: device,
          dtype: device === 'webgpu' ? 'q4f16' : 'q8', // Use q8 for WASM, q4f16 for WebGPU
          max_buffer_size: 512,
          powerPreference: 'high-performance',
          progress_callback: (p) => {
            if (p.status === 'progress') {
              setProgress(p.progress / 100);
              setLoadingPhase('downloading');
            }
          },
        });
        
        setGenerator(() => pipe);
        localStorage.setItem('passhork_model_id', modelId);
        
        // Mark as installed
        const saved = JSON.parse(localStorage.getItem('passhork_installed_models') || '[]');
        if (!saved.includes(modelId)) {
          saved.push(modelId);
          localStorage.setItem('passhork_installed_models', JSON.stringify(saved));
          setInstalledModels(saved);
        }
        
        setLoading(false);
        setLoadingPhase(null);
        success = true;
        setIsCached(true);
        break;
      } catch (err) {
        console.warn(`LLM initialization attempt ${attempt + 1} failed:`, err);
        
        if (err.name === 'QuotaExceededError') {
          setError('Storage full. Please clear browser cache and try again.');
          setLoading(false);
          setLoadingPhase(null);
          return;
        }

        if (attempt === maxRetries - 1) {
          setError('Failed to load AI model. Using Internal Mode as fallback.');
          setLoading(false);
          setLoadingPhase(null);
        } else {
          // Exponential backoff
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
        }
      }
    }
  }, [activeModelId, checkIsCached]);

  const generateWithAI = useCallback(async (phrase, targetLength = 15) => {
    if (!generator) return null;

    const prompt = `Generate a memorable ${targetLength}-character password from this phrase: "${phrase}"
Rules:
- Use substitutions like @ for 'a', ! for 'i', 3 for 'e'
- Keep phrase recognizable after transformation
- Add one special character: !@#$%&*-+()
- Target exactly ${targetLength} characters
- Must have: uppercase, lowercase, number, special char
- Avoid visually confusing characters like 0, O, 1, l, I
- Optimize for QWERTY typing flow (hand alternation)

Return ONLY the password, nothing else.`;

    try {
      const result = await generator(prompt, {
        max_new_tokens: 32,
        temperature: 0.7,
        do_sample: true,
      });

      let text = result[0].generated_text;
      if (text.includes(prompt)) {
        text = text.split(prompt).pop().trim();
      }
      
      const match = text.match(/[A-Za-z0-9!@#$%&*\-+()]{8,}/);
      return match ? match[0] : text.trim().split('\n')[0];
    } catch (err) {
      console.error('Inference error:', err);
      return null;
    }
  }, [generator]);

  const clearCache = useCallback(async () => {
    if ('caches' in window) {
      const keys = await caches.keys();
      for (const key of keys) {
        await caches.delete(key);
      }
      localStorage.removeItem('passhork_installed_models');
      setInstalledModels([]);
      setGenerator(null);
      setIsCached(false);
      return true;
    }
    return false;
  }, []);

  return { 
    initLLM, 
    generateWithAI, 
    loading, 
    loadingPhase,
    progress, 
    error, 
    isReady: !!generator, 
    isCached,
    activeModelId, 
    installedModels,
    clearCache
  };
};
