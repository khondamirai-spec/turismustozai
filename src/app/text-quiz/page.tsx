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
        <div className="min-h-screen p-6 font-sans text-white">
            <header className="flex items-center mb-8">
                <Link href="/" className="flex items-center text-indigo-100 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <ArrowLeft size={18} className="mr-2" />
                    <span className="font-semibold text-sm">Orqaga</span>
                </Link>
            </header>

            <div className="mb-8">
                <h1 className="text-3xl font-extrabold mb-2 text-white drop-shadow-md">
                    Mavzuni tanlang
                </h1>
                <p className="text-indigo-100 text-sm opacity-80">
                    Boshlash uchun toifani tanlang
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories?.map((category) => (
                    <Link
                        href={`/text-quiz/${category.id}`}
                        key={category.id}
                        className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden active:scale-95 transition-all duration-200 cursor-pointer flex flex-col shadow-lg hover:bg-white/20"
                    >
                        <div className="relative aspect-square overflow-hidden">
                            <img
                                src={category.image_url || "/placeholder.jpg"}
                                alt={category.name}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                {category.description && (
                                    <p className="text-sm font-medium text-gray-100 line-clamp-2 drop-shadow-sm">
                                        {category.description}
                                    </p>
                                )}
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
