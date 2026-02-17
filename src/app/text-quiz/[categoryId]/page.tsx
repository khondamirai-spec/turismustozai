import { supabase } from "@/utils/supabaseClient";
import QuizClient from "@/components/QuizClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: Promise<{
        categoryId: string;
    }>;
}

export default async function QuizPage({ params }: PageProps) {
    // Await the params to resolve before accessing properties
    // 1. Resolve Params
    const resolvedParams = await params;
    // Decode the categoryId since it's now a module name which might contain URI encoded characters
    const categoryName = decodeURIComponent(resolvedParams.categoryId);

    // 2. Fetch Questions and connected Options
    const { data: questionsData, error } = await supabase
        .from('quiz_questions')
        .select(`
            id,
            question_text,
            module,
            quiz_options (
                id,
                option_text,
                image_url,
                is_correct
            )
        `)
        .ilike('module', `${categoryName}%`);

    if (error) {
        console.error("Error fetching quiz data:", error);
        return <div className="p-6 text-white">Viktorinani yuklashda xatolik.</div>;
    }

    if (!questionsData || questionsData.length === 0) {
        return <div className="p-6 text-white">Ushbu mavzu bo'yicha savollar topilmadi.</div>;
    }

    // 3. Map to QuizClient format
    const questions = questionsData.map((q) => ({
        id: q.id,
        question_text: q.question_text,
        options: q.quiz_options?.map(o => {
            // Priority:
            // 1. Use option_text from database if it exists
            // 2. Fallback to extracting from URL if option_text is empty
            let label = o.option_text || "";

            if (!label && o.image_url) {
                try {
                    // Split by ? to remove query params, then by / to get path segments
                    const cleanUrl = o.image_url.split('?')[0];
                    const urlParts = cleanUrl.split('/').filter(Boolean);
                    const fileNameWithExt = urlParts[urlParts.length - 1];

                    if (fileNameWithExt) {
                        // Get filename without extension
                        const lastDotIndex = fileNameWithExt.lastIndexOf('.');
                        const fileName = lastDotIndex !== -1
                            ? fileNameWithExt.substring(0, lastDotIndex)
                            : fileNameWithExt;

                        // Decode URI characters (like %20 to space)
                        const decodedName = decodeURIComponent(fileName);

                        // If we have a valid decoded name, use it as the label
                        if (decodedName && decodedName !== "undefined" && decodedName !== "null") {
                            label = decodedName;
                        }
                    }
                } catch (e) {
                    console.error("Error parsing image URL for label:", e);
                }
            }

            return {
                id: o.id,
                image_url: o.image_url,
                label: label,
                is_correct: o.is_correct || false
            };
        }) || []
    }));

    // Filter questions that have at least one option (optional, but good for UX)
    const validQuestions = questions.filter(q => q.options.length > 0);

    console.log(`Fetched ${validQuestions.length} questions for module: ${categoryName}`);

    return (
        <QuizClient
            questions={validQuestions}
            categoryName={categoryName.toUpperCase()}
        />
    );
}
