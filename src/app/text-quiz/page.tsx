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
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <div className="bg-white/10 p-6 rounded-xl border border-white/20">
                    <p>Error loading topics. Please try again later.</p>
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

    const categories = uniqueMainModules.map((moduleName) => {
        // Count questions for this MAIN module (matches any sub-module starting with this name)
        const count = questions.filter(q => q.module.toLowerCase().startsWith(moduleName.toLowerCase())).length;

        return {
            id: moduleName,
            name: moduleName.toUpperCase(), // Display as "1-MODUL"
            description: `${count} Questions`,
            image_url: null
        };
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6 font-sans text-white">
            <header className="flex items-center mb-8">
                <Link href="/" className="flex items-center text-indigo-100 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <ArrowLeft size={18} className="mr-2" />
                    <span className="font-semibold text-sm">Back</span>
                </Link>
            </header>

            <div className="mb-8">
                <h1 className="text-3xl font-extrabold mb-2 text-white drop-shadow-md">
                    Choose Topic
                </h1>
                <p className="text-indigo-100 text-sm opacity-80">
                    Select a category to start your challenge
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
                                <h3 className="text-white font-bold text-lg leading-tight shadow-sm mb-1">
                                    {category.name}
                                </h3>
                                {category.description && (
                                    <p className="text-xs text-gray-300 line-clamp-2 opacity-80">
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
                    No categories found.
                </div>
            )}
        </div>
    );
}
