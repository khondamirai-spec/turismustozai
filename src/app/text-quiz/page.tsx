import { supabase } from "@/utils/supabaseClient";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TextQuizPage() {
    // Fetch modules directly from quiz_questions since categories table is gone
    const { data: queryData, error } = await supabase
        .from('quiz_questions')
        .select('module');

    if (error) {
        console.error("Error fetching modules:", error);
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                    <p>Mavzularni yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring.</p>
                </div>
            </div>
        );
    }

    // Deduplicate modules to act as categories (Group by "N-modul")
    const questions = queryData || [];
    const uniqueMainModules = Array.from(new Set(questions.map(q => {
        // Extract "1-modul" from "1-modul 1.1 mavzu"
        const match = q.module.match(/^(\d+-modul)/i);
        return match ? match[1] : q.module;
    }))).filter(Boolean);

    // sort naturally
    uniqueMainModules.sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    const moduleImages: { [key: string]: string } = {
        "1-modul": "/hf_20260208_062117_7d6ff0b8-9c5d-4073-a86a-4d602a10d6da.jpeg",
        "2-modul": "/hf_20260208_062158_0e0ac1d5-d23f-4f4a-be50-a47dcd53262f.jpeg",
        "3-modul": "/hf_20260208_062209_4aa4555d-a2fd-4032-8785-f8a304e250a3.jpeg",
        "4-modul": "/hf_20260208_062217_bd7986b6-b294-4e78-88bb-42d10ddf93a7.jpeg",
        "5-modul": "/hf_20260208_062229_e3996625-d80a-4970-a208-18c93b4169a9.jpeg",
        "6-modul": "/hf_20260208_062238_71750a2b-955a-4911-bb22-a27a80ef2dda.jpeg",
        "7-modul": "/hf_20260208_062243_be95b44b-5223-43c7-b948-d3f05b0eb523.jpeg",
        "8-modul": "/hf_20260208_062250_39b67f5a-cbc9-49bd-b2f8-325228821e2c.jpeg",
        "9-modul": "/hf_20260208_062258_e748dd01-da56-4da3-a6d1-eea87e396774.jpeg",
    };

    const categories = uniqueMainModules.map((moduleName) => {
        // Count questions for this MAIN module (matches any sub-module starting with this name)
        const count = questions.filter(q => q.module.toLowerCase().startsWith(moduleName.toLowerCase())).length;

        return {
            id: moduleName,
            name: moduleName.toUpperCase(), // Display as "1-MODUL"
            description: `${count} ta savol`,
            image_url: moduleImages[moduleName.toLowerCase()] || null
        };
    });

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
                    Reception 1.0
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories?.map((category) => (
                    <Link
                        href={`/text-quiz/${category.id}`}
                        key={category.id}
                        className="group relative bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/50 rounded-3xl p-5 transition-all duration-300 hover:bg-white/10 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100 duration-500"></div>

                        <div className="relative flex items-center gap-5 z-10">
                            <div className="flex-shrink-0 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center overflow-hidden shadow-inner ring-1 ring-white/5 group-hover:ring-white/20 transition-all duration-300">
                                <img
                                    src={category.image_url || "/placeholder.jpg"}
                                    alt={category.name}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h2 className="text-lg font-bold text-white group-hover:text-indigo-100 transition-colors truncate">
                                    {category.name}
                                </h2>
                            </div>

                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 group-hover:text-white group-hover:bg-white/10 transition-all duration-300">
                                <ArrowLeft className="rotate-180 w-4 h-4" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            {(!categories || categories.length === 0) && (
                <div className="text-center text-indigo-200 mt-10">
                    Hech qanday toifa topilmadi.
                </div>
            )}
        </div>
    );
}
