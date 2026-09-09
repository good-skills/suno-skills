import { Heart, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative py-12 px-6 bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-1">Prompt Temple</h3>
            <p className="text-sm text-slate-500">
              Open-source prompt library for AI image generation
            </p>
            <p dir="rtl" className="text-xs text-slate-600 mt-1">
              کتابخانه پرامپت متن‌باز برای تولید تصویر با هوش مصنوعی
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-white transition-colors duration-200"
            >
              <Github className="w-5 h-5" />
            </a>
            <div className="flex items-center gap-1.5 text-sm text-slate-500">
              Made with <Heart className="w-4 h-4 text-rose-500" /> for creators
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
