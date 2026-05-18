import { useState, useEffect, useCallback } from 'react';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = 'Xenova/TinyLlama-1.1B-Chat-v1.0';

export const useLLM = () => {
  const [generator, setGenerator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const initLLM = useCallback(async () => {
    if (generator) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const pipe = await pipeline('text-generation', MODEL_ID, {
        progress_callback: (p) => {
          if (p.status === 'progress') {
            setProgress(p.progress);
          }
        },
      });
      setGenerator(() => pipe);
      setLoading(false);
    } catch (err) {
      console.error('Failed to initialize LLM:', err);
      setError('Failed to load AI model. Please check your internet connection and try again.');
      setLoading(false);
    }
  }, [generator]);

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

      // Extract the generated text and clean it
      let text = result[0].generated_text;
      // Depending on the model, it might include the prompt. 
      // Transformers.js usually returns the full text including prompt if not careful.
      if (text.includes(prompt)) {
        text = text.split(prompt).pop().trim();
      }
      
      // Clean up any extra words
      const match = text.match(/[A-Za-z0-9!@#$%&*\-+()]{8,}/);
      return match ? match[0] : text.trim().split('\n')[0];
    } catch (err) {
      console.error('Inference error:', err);
      return null;
    }
  }, [generator]);

  return { initLLM, generateWithAI, loading, progress, error, isReady: !!generator };
};
