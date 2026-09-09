import { useCallback, useEffect, useState } from 'react';

/**
 * Multi-provider LLM registry.
 *
 * Keyless providers (no signup, works out of the box):
 *  - llm7.io        : rich catalog (minimax-m2.7, gemini-3-flash, gpt-5.5, claude-sonnet-5, ...)
 *  - Pollinations   : GPT-OSS 20B, anonymous tier
 *
 * Bring-your-own-key (BYOK) providers — all verified to allow direct browser calls (CORS *):
 *  - Groq           : ultra-fast LPU inference
 *  - Google Gemini  : via the OpenAI-compat endpoint
 *  - Cerebras       : fastest tokens/sec on open models
 *  - Mistral        : La Plateforme
 *  - OpenRouter     : gateway to 300+ models incl. free tier
 */

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

export interface LlmConfig {
  providerId: string;
  model?: string;
  apiKey?: string;
  messages: ChatMessage[];
}

export interface ProviderDef {
  id: string;
  name: string;
  baseUrl: string;
  keyless: boolean;
  envKey?: string; // import.meta.env name for optional build-time config
  models: string[];
  defaultModel: string;
  keyUrl?: string;
  note?: string;
}

export const PROVIDERS: ProviderDef[] = [
  {
    id: 'llm7',
    name: 'LLM7.io',
    baseUrl: 'https://api.llm7.io/v1/chat/completions',
    keyless: true,
    models: [
      'minimax-m2.7',
      'gemini-3-flash',
      'gpt-5.5',
      'gemini-3.8-flash-high',
      'claude-sonnet-5',
      'grok-4.6',
      'glm-5.3-flash',
      'deepseek-v4-flash:0731',
      'mistral-Nemo-Instruct-2407',
    ],
    defaultModel: 'minimax-m2.7',
    note: 'Free, no key. Rich catalog — strong for multilingual (Persian) work.',
  },
  {
    id: 'pollinations',
    name: 'Pollinations',
    baseUrl: 'https://text.pollinations.ai/openai',
    keyless: true,
    models: ['openai', 'openai-fast'],
    defaultModel: 'openai',
    note: 'Free, keyless. GPT-OSS 20B reasoning model. Anonymous fair-use tier.',
  },
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    keyless: false,
    envKey: 'VITE_GROQ_API_KEY',
    models: ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b', 'openai/gpt-oss-120b', 'groq/compound', 'allam-2-7b'],
    defaultModel: 'qwen/qwen3.8-27b',
    keyUrl: 'https://console.groq.com/keys',
    note: 'Ultra-fast inference, free tier. Key must have chat models enabled at org/project level.',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    keyless: false,
    envKey: 'VITE_GEMINI_API_KEY',
    models: ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-1.5-flash', 'gemini-1.5-pro'],
    defaultModel: 'gemini-2.0-flash',
    keyUrl: 'https://aistudio.google.com/apikey',
    note: 'Generous free tier via Google AI Studio.',
  },
  {
    id: 'cerebras',
    name: 'Cerebras',
    baseUrl: 'https://api.cerebras.ai/v1/chat/completions',
    keyless: false,
    envKey: 'VITE_CEREBRAS_API_KEY',
    models: ['llama-3.3-70b', 'llama-4-maverick', 'qwen-3-32b', 'gpt-oss-120b'],
    defaultModel: 'llama-3.3-70b',
    keyUrl: 'https://cloud.cerebras.ai',
    note: 'Fastest tokens/sec on open models. Free tier available.',
  },
  {
    id: 'mistral',
    name: 'Mistral',
    baseUrl: 'https://api.mistral.ai/v1/chat/completions',
    keyless: false,
    envKey: 'VITE_MISTRAL_API_KEY',
    models: ['mistral-large-latest', 'mistral-small-latest', 'open-mistral-nemo', 'codestral-latest'],
    defaultModel: 'mistral-small-latest',
    keyUrl: 'https://console.mistral.ai/api-keys',
    note: 'Free experiment tier on La Plateforme.',
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    keyless: false,
    envKey: 'VITE_OPENROUTER_API_KEY',
    models: [
      'google/gemini-2.0-flash-exp:free',
      'deepseek/deepseek-chat-v3-0324:free',
      'meta-llama/llama-3.3-70b-instruct',
      'openai/gpt-4o-mini',
      'anthropic/claude-3.5-haiku',
    ],
    defaultModel: 'google/gemini-2.0-flash-exp:free',
    keyUrl: 'https://openrouter.ai/keys',
    note: 'Gateway to 300+ models incl. free variants. Great for trying exotic models.',
  },
];

export function isKeyless(id: string): boolean {
  return PROVIDERS.find((p) => p.id === id)?.keyless ?? false;
}

function readEnv(name: string): string | undefined {
  try {
    const env = import.meta.env as Record<string, string | undefined>;
    return env[name];
  } catch {
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// BYOK storage (localStorage). Keys never leave the browser except to the
// chosen provider's own API endpoint.
// ---------------------------------------------------------------------------

const BYOK_PREFIX = 'suno-skills:byok:';

export function getStoredKey(providerId: string): string | null {
  try {
    return localStorage.getItem(BYOK_PREFIX + providerId);
  } catch {
    return null;
  }
}

export function setStoredKey(providerId: string, key: string | null): void {
  try {
    if (key) localStorage.setItem(BYOK_PREFIX + providerId, key);
    else localStorage.removeItem(BYOK_PREFIX + providerId);
  } catch {
    // localStorage unavailable (private mode etc.) — silently degrade
  }
}

export function getStoredModel(providerId: string): string | null {
  try {
    return localStorage.getItem(BYOK_PREFIX + providerId + ':model');
  } catch {
    return null;
  }
}

export function setStoredModel(providerId: string, model: string): void {
  try {
    localStorage.setItem(BYOK_PREFIX + providerId + ':model', model);
  } catch {
    // ignore
  }
}

export function getStoredActiveProvider(): string | null {
  try {
    return localStorage.getItem(BYOK_PREFIX + 'active-provider');
  } catch {
    return null;
  }
}

export function setStoredActiveProvider(id: string): void {
  try {
    localStorage.setItem(BYOK_PREFIX + 'active-provider', id);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Active selection resolution: stored user choice > env key > keyless default
// ---------------------------------------------------------------------------

export interface ActiveAi {
  providerId: string;
  model: string;
  apiKey?: string;
  source: 'user' | 'env' | 'default';
}

export function resolveActiveAi(): ActiveAi {
  const storedProvider = getStoredActiveProvider();
  const candidates = storedProvider ? [storedProvider, ...PROVIDERS.filter((p) => p.id !== storedProvider).map((p) => p.id)] : PROVIDERS.map((p) => p.id);

  for (const id of candidates) {
    const def = PROVIDERS.find((p) => p.id === id);
    if (!def) continue;

    const storedKey = getStoredKey(id);
    const envKey = def.envKey ? readEnv(def.envKey) : undefined;
    const apiKey = storedKey || envKey || undefined;

    if (!def.keyless && !apiKey) continue; // no usable key → skip
    const model = getStoredModel(id) ?? def.defaultModel;
    const source: ActiveAi['source'] = storedKey ? 'user' : envKey ? 'env' : 'default';
    return { providerId: id, model, apiKey, source };
  }

  // Absolute fallback: first keyless provider
  const firstKeyless = PROVIDERS.find((p) => p.keyless)!;
  return { providerId: firstKeyless.id, model: firstKeyless.defaultModel, source: 'default' };
}

export async function chat(config: LlmConfig): Promise<string> {
  const def = PROVIDERS.find((p) => p.id === config.providerId);
  if (!def) throw new Error(`Unknown provider: ${config.providerId}`);

  const apiKey = config.apiKey;
  if (!def.keyless && !apiKey) {
    throw new Error(`${def.name} requires an API key. Add one in Settings (gear icon).`);
  }

  const model = config.model || def.defaultModel;
  const url = def.baseUrl.replace('{model}', encodeURIComponent(model));

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
  if (def.id === 'openrouter') {
    headers['HTTP-Referer'] = typeof window !== 'undefined' ? window.location.origin : 'https://suno-skills.local';
    headers['X-Title'] = 'Suno Skills';
  }

  const body = {
    model,
    messages: config.messages,
    temperature: 0.8,
  };

  let res: Response;
  try {
    res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  } catch {
    throw new Error(`Network error while contacting ${def.name}.`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`${def.name} error ${res.status}: ${text.slice(0, 250)}`.trim());
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error(`${def.name} returned an empty response.`);
  }
  return content;
}

/** Lightweight connectivity/permission test used by the settings panel. */
export async function testProvider(
  providerId: string,
  apiKey?: string,
  model?: string
): Promise<{ ok: true; sample: string } | { ok: false; error: string }> {
  try {
    const sample = await chat({
      providerId,
      apiKey,
      model,
      messages: [{ role: 'user', content: 'Reply with exactly: OK' }],
    });
    return { ok: true, sample: sample.trim().slice(0, 60) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

// ---------------------------------------------------------------------------
// useAiSettings hook — single source of truth for the AI configuration UI
// ---------------------------------------------------------------------------

export function useAiSettings() {
  const [active, setActive] = useState<ActiveAi>(() => resolveActiveAi());
  const [status, setStatus] = useState<{ providerId: string; ok: boolean; message: string } | null>(null);

  // Re-resolve when the tab regains focus (env vars may have changed via rebuild)
  useEffect(() => {
    const onVisible = () => setActive(resolveActiveAi());
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const selectProvider = useCallback((providerId: string) => {
    setStoredActiveProvider(providerId);
    const def = PROVIDERS.find((p) => p.id === providerId);
    const model = def ? getStoredModel(providerId) ?? def.defaultModel : '';
    setActive((prev) => ({ ...prev, providerId, model }));
    setStatus(null);
  }, []);

  const selectModel = useCallback((model: string) => {
    setStoredModel(active.providerId, model);
    setActive((prev) => ({ ...prev, model }));
    setStatus(null);
  }, [active.providerId]);

  const saveKey = useCallback((providerId: string, key: string | null) => {
    setStoredKey(providerId, key);
    setActive(resolveActiveAi());
    setStatus(null);
  }, []);

  const clearStatus = useCallback(() => setStatus(null), []);

  return { active, status, selectProvider, selectModel, saveKey, setStatus, clearStatus };
}
