import Link from "next/link";
import { BookOpen, Mic } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-6 font-sans text-white">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-2 tracking-tight drop-shadow-md">
          Turizm Viktorinasi
        </h1>
        <p className="text-indigo-100 text-lg font-medium tracking-wide">
          O'z sinovungizni tanlang
        </p>
      </header>

      <main className="flex flex-col gap-5 w-full max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
          <Link href="/text-quiz" className="w-full group">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-xl cursor-pointer h-full">
              <div className="bg-white text-indigo-600 p-3 rounded-xl shadow-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <BookOpen size={28} />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-xl font-bold">Turizm reception 1.0</h2>
                <p className="text-indigo-100 text-sm opacity-80">Turism va reception savollari</p>
              </div>
              <div className="text-white/60 group-hover:text-white transition-colors">
                &rarr;
              </div>
            </div>
          </Link>

          <Link href="/turism-2" className="w-full group">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-xl cursor-pointer h-full">
              <div className="bg-white text-emerald-600 p-3 rounded-xl shadow-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <BookOpen size={28} />
              </div>
              <div className="flex-1 text-left">
                <h2 className="text-xl font-bold">Turizm reception 2.0</h2>
                <p className="text-indigo-100 text-sm opacity-80">Yangi savollar va mavzular</p>
              </div>
              <div className="text-white/60 group-hover:text-white transition-colors">
                &rarr;
              </div>
            </div>
          </Link>
        </div>

        <Link href="/voice-quiz" className="w-full group">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-5 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-xl cursor-pointer">
            <div className="bg-white text-purple-600 p-3 rounded-xl shadow-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Mic size={28} />
            </div>
            <div className="flex-1 text-left">
              <h2 className="text-xl font-bold">Ovozli Viktorina</h2>
              <p className="text-indigo-100 text-sm opacity-80">Javoblaringizni ayting</p>
            </div>
            <div className="text-white/60 group-hover:text-white transition-colors">
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
