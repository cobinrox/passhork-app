import { useState, useCallback, useEffect } from 'react';
import { useLLM } from './useLLM';
import { FALLBACK_PHRASES } from '../utils/phraseDatabase';
import { checkComplexity } from '../utils/complexityChecker';
import { scoreErgonomics } from '../utils/ergoScorer';

export const usePassword = () => {
  const { 
    initLLM, 
    generateWithAI, 
    loading: llmLoading, 
    progress, 
    error: llmError, 
    isReady,
    activeModelId,
    installedModels,
    clearCache
  } = useLLM();

  const [password, setPassword] = useState('');
  const [originalPhrase, setOriginalPhrase] = useState('');
  const [generating, setGenerating] = useState(false);
  const [targetLength, setTargetLength] = useState(15);
  const [useAIPreference, setUseAIPreference] = useState(() => {
    return localStorage.getItem('passhork_use_ai') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('passhork_use_ai', useAIPreference);
  }, [useAIPreference]);

  const generate = useCallback(async (phraseInput = null) => {
    setGenerating(true);
    
    let phrase = phraseInput;
    let newPassword = '';
    
    // If no phrase provided, pick one from fallback
    if (!phrase) {
      const randomIndex = Math.floor(Math.random() * FALLBACK_PHRASES.length);
      const selected = FALLBACK_PHRASES[randomIndex];
      phrase = selected.phrase;
      
      // If not using AI or AI not ready, use the pre-generated password from fallback
      if (!useAIPreference || !isReady) {
        newPassword = selected.password;
      }
    }

    setOriginalPhrase(phrase);

    // Only use AI if user wants it AND it's ready
    if (useAIPreference && isReady) {
      try {
        const aiPassword = await generateWithAI(phrase, targetLength);
        if (aiPassword) {
          newPassword = aiPassword;
        }
      } catch (err) {
        console.warn('AI generation failed, falling back to internal logic');
      }
    }

    // If still no password (AI failed, not ready, or Internal Mode for custom phrase)
    if (!newPassword) {
       // Simple transformation for phrases
       newPassword = phrase
        .replace(/a/gi, '@')
        .replace(/e/gi, '3')
        .replace(/i/gi, '!')
        .replace(/o/gi, '8') // Use 8 instead of 0
        .replace(/s/gi, '$')
        .replace(/\s+/g, '')
        + (Math.floor(Math.random() * 8) + 2) + '!'; // Use digits 2-9
    }

    // Ensure it's approximately the target length (allow some buffer)
    if (newPassword.length > targetLength + 2) {
      newPassword = newPassword.substring(0, targetLength + 1);
    }

    setPassword(newPassword);
    setGenerating(false);
  }, [isReady, generateWithAI, targetLength, useAIPreference]);

  return {
    password,
    originalPhrase,
    generating: generating || llmLoading,
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
    complexity: checkComplexity(password),
    ergoScore: scoreErgonomics(password),
  };
};
