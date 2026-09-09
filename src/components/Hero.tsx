import { Music, Sparkles, ArrowDown, Github, Play } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onSurprise: () => void;
}

export function Hero({ onExplore, onSurprise }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Animated orbs */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-sky-500/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-amber-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-[28rem] h-[28rem] bg-rose-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge — the compiler identity, demoted to eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
          <Music className="w-4 h-4 text-sky-400" />
          <span className="text-sm text-slate-300 font-medium tracking-wide">
            Music Intent → Suno Prompt Compiler
          </span>
        </div>

        {/* Title — sell the result, not the technology */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Turn your music idea into a Suno-ready prompt
          </span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
          Describe the song you have in your head.
          We&apos;ll turn it into a detailed musical direction you can paste straight into Suno.
        </p>

        <p dir="rtl" className="text-base text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          آهنگی که تو ذهنت است را بنویس — ما آن را به یک مسیر موسیقایی دقیق و آماده‌ی Suno تبدیل می‌کنیم.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={onExplore}
            className="group px-8 py-3.5 rounded-xl bg-white text-slate-900 font-semibold text-base
                       hover:bg-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/10
                       flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Describe Your Song
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
          <button
            onClick={onSurprise}
            className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-semibold text-base
                       hover:bg-white/10 transition-all duration-300 hover:scale-105
                       flex items-center gap-2 backdrop-blur-sm"
          >
            <Play className="w-4 h-4" />
            Surprise me
          </button>
          <a
            href="https://github.com/good-skills/suno-skills"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 font-semibold text-base
                       hover:bg-white/10 transition-all duration-300 hover:scale-105
                       flex items-center gap-2 backdrop-blur-sm hidden sm:flex"
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-bold text-white">12</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Genres</div>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div>
            <div className="text-2xl font-bold text-white">10</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Emotions</div>
          </div>
          <div className="w-px h-10 bg-slate-800">
          </div>
          <div>
            <div className="text-2xl font-bold text-white">18</div>
            <div className="text-xs text-slate-500 uppercase tracking-wide">Instruments</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-white/15 flex items-start justify-center p-1.5">
          <div className="w-1 h-2 bg-white/30 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
