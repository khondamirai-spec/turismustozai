import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import {
    ArrowLeft,
    Hotel,
    UserCheck,
    UserCog,
    MessageCircle,
    Shirt,
    LogIn,
    LogOut,
    Phone,
    Mail,
    CalendarRange,
    Frown,
    ShieldAlert,
    Banknote,
    ShieldCheck,
    Clock,
    Globe2,
    Accessibility,
    Siren,
    Users,
    FileText,
    GraduationCap,
    LucideIcon
} from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TurismTwoPage() {
    // Generate 20 themes (1-mavzu to 20-mavzu)
    const uniqueThemes = Array.from({ length: 20 }, (_, i) => `${i + 1}-mavzu`);

    // Icon mapping for each theme
    const themeIcons: Record<string, LucideIcon> = {
        "1-mavzu": UserCheck,      // Kutib olish
        "2-mavzu": UserCog,        // Professional rol
        "3-mavzu": MessageCircle,  // Nutq madaniyati
        "4-mavzu": Shirt,          // Dress-code
        "5-mavzu": LogIn,          // Check-in
        "6-mavzu": LogOut,         // Check-out
        "7-mavzu": Phone,          // Telefon
        "8-mavzu": Mail,           // Yozma/Online
        "9-mavzu": CalendarRange,  // Bron qilish
        "10-mavzu": Frown,         // Shikoyatlar
        "11-mavzu": ShieldAlert,   // Nizoli mehmonlar
        "12-mavzu": Banknote,      // Sotish
        "13-mavzu": ShieldCheck,   // Xavfsizlik
        "14-mavzu": Clock,         // Vaqtni boshqarish
        "15-mavzu": Globe2,        // Xalqaro mehmonlar
        "16-mavzu": Accessibility, // Nogironligi bor
        "17-mavzu": Siren,         // Favqulodda vaziyat
        "18-mavzu": Users,         // Jamoa
        "19-mavzu": FileText,      // Hujjatlar
        "20-mavzu": GraduationCap, // Rivojlanish
    };

    return (
        <div className="min-h-screen p-6 font-sans text-white pb-20">
            <header className="flex items-center mb-10">
                <Link href="/" className="group flex items-center text-indigo-200/80 hover:text-white transition-all bg-white/5 hover:bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 hover:border-white/20">
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold text-sm">Orqaga</span>
                </Link>
            </header>

            <div className="mb-10 px-2 space-y-2">
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300 drop-shadow-sm tracking-tight">
                    Reception 2.0
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {uniqueThemes.map((theme) => {
                    const IconComponent = themeIcons[theme] || Hotel;

                    return (
                        <Link
                            href={`/turism-2/${encodeURIComponent(theme)}`}
                            key={theme}
                            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 rounded-3xl p-5 transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100 duration-500"></div>

                            <div className="relative flex items-center gap-5 z-10">
                                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center text-indigo-300 group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-300 shadow-inner group-hover:shadow-indigo-500/50 ring-1 ring-white/5 group-hover:ring-white/20">
                                    <IconComponent size={26} strokeWidth={1.5} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-bold text-white group-hover:text-indigo-100 transition-colors truncate">
                                        {theme}
                                    </h2>
                                </div>

                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:text-white group-hover:bg-white/10 transition-all duration-300">
                                    <ArrowLeft className="rotate-180 w-4 h-4" />
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {uniqueThemes.length === 0 && (
                <div className="text-center text-indigo-200 mt-20">
                    <p className="text-xl">Hozircha mavzular mavjud emas.</p>
                </div>
            )}
        </div>
    );
}
