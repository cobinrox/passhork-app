import { useState, useCallback } from 'react';
import { useLLM } from './useLLM';
import { FALLBACK_PHRASES } from '../utils/phraseDatabase';
import { checkComplexity } from '../utils/complexityChecker';
import { scoreErgonomics } from '../utils/ergoScorer';

export const usePassword = () => {
  const { initLLM, generateWithAI, loading: llmLoading, progress, error: llmError, isReady } = useLLM();
  const [password, setPassword] = useState('');
  const [originalPhrase, setOriginalPhrase] = useState('');
  const [generating, setGenerating] = useState(false);
  const [targetLength, setTargetLength] = useState(15);

  const generate = useCallback(async (phraseInput = null) => {
    setGenerating(true);
    
    let phrase = phraseInput;
    let newPassword = '';
    
    // If no phrase provided, pick one from fallback
    if (!phrase) {
      const randomIndex = Math.floor(Math.random() * FALLBACK_PHRASES.length);
      const selected = FALLBACK_PHRASES[randomIndex];
      phrase = selected.phrase;
      // We might use the pre-generated password as a starting point if AI isn't ready
      if (!isReady) {
        newPassword = selected.password;
      }
    }

    setOriginalPhrase(phrase);

    if (isReady) {
      const aiPassword = await generateWithAI(phrase, targetLength);
      if (aiPassword) {
        newPassword = aiPassword;
      }
    }

    // If still no password (AI failed or not ready), and it wasn't a fallback phrase
    if (!newPassword) {
       // Simple transformation for user-provided phrases
       newPassword = phrase
        .replace(/a/gi, '@')
        .replace(/e/gi, '3')
        .replace(/i/gi, '!')
        .replace(/o/gi, '0')
        .replace(/s/gi, '$')
        .replace(/\s+/g, '')
        + Math.floor(Math.random() * 10) + '!';
    }

    // Ensure it's approximately the target length
    if (newPassword.length > targetLength + 2) {
      newPassword = newPassword.substring(0, targetLength + 1);
    }

    setPassword(newPassword);
    setGenerating(false);
  }, [isReady, generateWithAI, targetLength]);

  return {
    password,
    originalPhrase,
    generating: generating || llmLoading,
    progress,
    llmError,
    targetLength,
    setTargetLength,
    generate,
    initLLM,
    isReady,
    complexity: checkComplexity(password),
    ergoScore: scoreErgonomics(password),
  };
};
