# Suno Skills — Music Intent → Suno Prompt Compiler

A bilingual (English + Persian) web app that turns a musical vision — genre, emotion,
instruments, energy, structure — into an optimized prompt for
[Suno AI](https://suno.com), using a curated music-theory knowledge base plus
**multi-provider AI enhancement and side-by-side variant comparison**.

Built with React, Vite, Tailwind CSS, and lucide-react icons.

## Features

- **Prompt compiler** — rule engine maps 12 genres × 10 emotions × 18 instruments ×
  5 energy levels onto concrete musical language (tonality, melodic contour, harmony,
  dynamics, production style)
- **Multi-provider AI enhancement** — 7 LLM providers, switchable at runtime
- **Compare AI variants** — send one spec to several engines in parallel and tab
  through their different takes on the same musical idea
- **BYOK (bring your own key)** — keys are stored in the browser's localStorage and
  sent only to the provider itself; keyless providers need nothing at all
- **Connection tester** — verify any provider/model combo with one click before using it
- **Conflict detection** — flags contradictory specs (e.g. piano-solo + 5 instruments,
  very-fast tempo + calm mood) and auto-applies negative constraints
- **Quick templates** — 8 ready-made presets (solo sad piano, epic trailer, lo-fi,
  meditation, horror, …)
- **Bilingual UI** — English + Persian/Farsi RTL explanations throughout
- **Quality scores** — intent match, genre/emotion accuracy, instrument consistency,
  Suno compatibility

## AI providers

| Provider | Key needed | Default model | Notes |
| ----------------- | ---------- | ------------------------- | ------------------------------------------ |
| LLM7.io | **No** | `minimax-m2.7` | Keyless; big catalog (Gemini 3, GPT-5.5, Claude Sonnet 5, Grok 4.6, …) |
| Pollinations | **No** | `openai` (GPT-OSS 20B) | Keyless; anonymous fair-use tier |
| Groq | `VITE_GROQ_API_KEY` or in-app | `qwen/qwen3.8-27b` | Ultra-fast; org/project must enable chat models |
| Google Gemini | `VITE_GEMINI_API_KEY` or in-app | `gemini-2.0-flash` | Generous free tier via AI Studio |
| Cerebras | `VITE_CEREBRAS_API_KEY` or in-app | `llama-3.3-70b` | Fastest tokens/sec on open models |
| Mistral | `VITE_MISTRAL_API_KEY` or in-app | `mistral-small-latest` | Free experiment tier on La Plateforme |
| OpenRouter | `VITE_OPENROUTER_API_KEY` or in-app | `google/gemini-2.0-flash-exp:free` | 300+ models incl. free variants |

The app works out of the box with the two keyless providers. Users can add their own
keys in the **AI Engine** settings (gear icon in the output panel) — keys persist in
`localStorage` and are never sent anywhere except the chosen provider. Optionally,
keys can be baked in at build time via the `VITE_*` env vars above (create `.env.local`).

If an AI request fails (network, provider error, rate limit, malformed reply), the app
falls back to the rule-based prompt and shows the reason as a warning — it never blocks
the user. In compare mode, each provider's failure is reported individually.

## Development

```bash
npm install
npm run dev      # start dev server
npm run build    # production build → dist/
npm run typecheck
```

## Deployment

Static output in `dist/` — deployable to GitHub Pages, Vercel, Netlify, or any
static host. No server-side component; LLM calls happen from the browser.
