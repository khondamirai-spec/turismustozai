import { supabase } from "@/utils/supabaseClient";
import QuizClient from "@/components/QuizClient";

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
        return <div className="p-6 text-white">Error loading quiz.</div>;
    }

    if (!questionsData || questionsData.length === 0) {
        return <div className="p-6 text-white">No questions found for this topic.</div>;
    }

    // 3. Map to QuizClient format
    const questions = questionsData.map((q, index) => ({
        id: q.id,
        question_text: q.question_text,
        options: q.quiz_options?.map(o => ({
            id: o.id,
            image_url: o.image_url,
            label: o.option_text || "",
            is_correct: o.is_correct || false
        })) || []
    }));

    // Filter questions that have at least one option (optional, but good for UX)
    const validQuestions = questions.filter(q => q.options.length > 0);

    console.log(`Fetched ${validQuestions.length} questions for module: ${categoryName}`);

    return (
        <QuizClient
            questions={validQuestions}
            categoryName={categoryName}
        />
    );
}
