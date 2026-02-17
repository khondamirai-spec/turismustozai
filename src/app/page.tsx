import Link from "next/link";
import { BookOpen, Mic } from "lucide-react";
import StarBackground from "@/components/StarBackground";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-0 px-6 pb-6 font-sans text-white relative">
      <StarBackground />
      <header className="-mb-6 text-center flex flex-col items-center justify-center">
        <img
          src="/logo/hf_20260217_080417_3e77026e-ae70-4319-b57c-62a724b766ae-removebg-preview.png"
          alt="Turizm Viktorinasi Logo"
          className="max-w-[300px] w-full h-auto drop-shadow-lg filter brightness-110"
        />
      </header>

      <main className="flex flex-col gap-4 w-full max-w-md mx-auto">
        <Link href="/text-quiz" className="w-full group">
          <div className="bg-[#252538] border border-white/5 rounded-3xl p-4 flex items-center gap-5 hover:border-white/20 hover:bg-[#2a2a40] transition-all duration-300 transform active:scale-95 shadow-lg group-hover:shadow-indigo-500/10 cursor-pointer">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <BookOpen size={26} className="text-indigo-600" strokeWidth={2.5} />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-lg font-bold text-white leading-tight">Turizm reception 1.0</h2>
              <p className="text-gray-400 text-xs font-medium mt-0.5">Turism va reception savollari</p>
            </div>
            <div className="text-gray-600 group-hover:text-white transition-colors px-2">
              &rarr;
            </div>
          </div>
        </Link>

        <Link href="/turism-2" className="w-full group">
          <div className="bg-[#252538] border border-white/5 rounded-3xl p-4 flex items-center gap-5 hover:border-white/20 hover:bg-[#2a2a40] transition-all duration-300 transform active:scale-95 shadow-lg group-hover:shadow-emerald-500/10 cursor-pointer">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <BookOpen size={26} className="text-emerald-500" strokeWidth={2.5} />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-lg font-bold text-white leading-tight">Turizm reception 2.0</h2>
              <p className="text-gray-400 text-xs font-medium mt-0.5">Yangi savollar va mavzular</p>
            </div>
            <div className="text-gray-600 group-hover:text-white transition-colors px-2">
              &rarr;
            </div>
          </div>
        </Link>

        <Link href="/voice-quiz" className="w-full group">
          <div className="bg-[#252538] border border-white/5 rounded-3xl p-4 flex items-center gap-5 hover:border-white/20 hover:bg-[#2a2a40] transition-all duration-300 transform active:scale-95 shadow-lg group-hover:shadow-purple-500/10 cursor-pointer">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
              <Mic size={26} className="text-purple-600" strokeWidth={2.5} />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-lg font-bold text-white leading-tight">Ovozli Viktorina</h2>
              <p className="text-gray-400 text-xs font-medium mt-0.5">Javoblaringizni ayting</p>
            </div>
            <div className="text-gray-600 group-hover:text-white transition-colors px-2">
              &rarr;
            </div>
          </div>
        </Link>
      </main>

      <footer className="absolute bottom-6 text-indigo-200 text-xs opacity-60">
        © 2026 Turizm Viktorinasi
      </footer>
    </div>
  );
}
