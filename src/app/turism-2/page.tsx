import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import { ArrowLeft, Hotel } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TurismTwoPage() {
    // Generate 20 themes (1-mavzu to 20-mavzu)
    const uniqueThemes = Array.from({ length: 20 }, (_, i) => `${i + 1}-mavzu`);

    // Theme descriptions mapping
    const themeDescriptions: Record<string, string> = {
        "1-mavzu": "Mehmonni kutib olish standartlari",
        "2-mavzu": "Reseption xodimining professional roli va mas'uliyati",
        "3-mavzu": "Reseptionda nutq madaniyati va muloqot ohangi",
        "4-mavzu": "Reseption xodimining tashqi ko'rinishi va dress-code",
        "5-mavzu": "Check-in jarayonining professional algoritmi",
        "6-mavzu": "Check-out jarayoni va mehmon bilan xayrlashuv",
        "7-mavzu": "Reseptionda telefon orqali muloqot qoidalari",
        "8-mavzu": "Reseptionda yozma va onlayn murojaatlar bilan ishlash",
        "9-mavzu": "Bron qilish tizimi va ma'lumotlar aniqligi",
        "10-mavzu": "Mehmon shikoyatlari bilan ishlash texnikasi",
        "11-mavzu": "Qiyin va nizoli mehmonlar bilan muloqot",
        "12-mavzu": "Xizmatni taklif qilish va sotish",
        "13-mavzu": "Xavfsizlik va maxfiylik qoidalari",
        "14-mavzu": "Reseptionda vaqtni boshqarish",
        "15-mavzu": "Xalqaro mehmonlar bilan ishlash madaniyati",
        "16-mavzu": "Nogironligi bor va maxsus ehtiyojli mehmonlar bilan ishlash",
        "17-mavzu": "Favqulodda vaziyatlarda reseption xodimi harakati",
        "18-mavzu": "Jamoa bilan ishlash va ichki aloqa",
        "19-mavzu": "Reseptionda hujjatlar va ichki tartiblar",
        "20-mavzu": "Reseption xodimining professional rivoji",
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6 font-sans text-white">
            <header className="flex items-center mb-8">
                <Link href="/" className="flex items-center text-indigo-100 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <ArrowLeft size={18} className="mr-2" />
                    <span className="font-semibold text-sm">Orqaga</span>
                </Link>
            </header>

            <div className="mb-8 px-2">
                <h1 className="text-3xl font-extrabold mb-2 text-white drop-shadow-md tracking-tight">
                    Turizm Reception 2.0
                </h1>
                <p className="text-indigo-100 text-sm opacity-80">
                    Sizni qiziqtirgan mavzuni tanlang
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uniqueThemes.map((theme) => (
                    <Link
                        href={`/turism-2/${encodeURIComponent(theme)}`}
                        key={theme}
                        className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-xl cursor-pointer flex items-center gap-5"
                    >
                        <div className="bg-white/10 p-3 rounded-xl text-white group-hover:bg-white group-hover:text-indigo-600 transition-all duration-300 shadow-inner">
                            <Hotel size={24} />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold mb-0.5 tracking-tight">{theme}</h2>
                            <p className="text-indigo-100 text-[12px] font-medium opacity-80 leading-tight">
                                {themeDescriptions[theme] || "Keyingi mavzu uchun savollar"}
                            </p>
                        </div>
                        <div className="text-white/20 group-hover:text-white transition-colors">
                            <ArrowLeft className="rotate-180" size={18} />
                        </div>
                    </Link>
                ))}
            </div>

            {uniqueThemes.length === 0 && (
                <div className="text-center text-indigo-200 mt-20">
                    <p className="text-xl">Hozircha mavzular mavjud emas.</p>
                </div>
            )}
        </div>
    );
}
