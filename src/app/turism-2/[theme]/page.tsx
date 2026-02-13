import { supabase } from "@/utils/supabaseClient";
import TurismTwoQuizClient from "@/components/TurismTwoQuizClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: Promise<{
        theme: string;
    }>;
}

export default async function TurismTwoQuizPage({ params }: PageProps) {
    const resolvedParams = await params;
    const themeName = decodeURIComponent(resolvedParams.theme);

    // Fetch all rows for this theme
    const { data: rows, error } = await supabase
        .from('turism_questions_v2')
        .select('*')
        .eq('theme', themeName)
        .order('question', { ascending: true })
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching quiz data:", error);
        return <div className="p-6 text-white bg-indigo-600 min-h-screen flex items-center justify-center">Viktorinani yuklashda xatolik.</div>;
    }

    if (!rows || rows.length === 0) {
        return <div className="p-6 text-white bg-indigo-600 min-h-screen flex items-center justify-center">Ushbu mavzu bo'yicha savollar topilmadi.</div>;
    }

    // Group rows by question field
    const questionMap: { [key: string]: any } = {};
    rows.forEach(row => {
        if (!questionMap[row.question]) {
            questionMap[row.question] = {
                id: row.question, // Use question label ("1-savol") as unique ID within theme
                question_text: row.question_text, // Use the actual question text
                options: []
            };
        }
        questionMap[row.question].options.push({
            id: row.id,
            image_url: row.option_pic,
            label: row.option_text,
            is_correct: row.correct_answer
        });
    });

    // Convert map to array and sort by question identifier (e.g., "1-test", "2-test")
    const questions = Object.values(questionMap).sort((a, b) =>
        a.id.localeCompare(b.id, undefined, { numeric: true })
    );

    return (
        <TurismTwoQuizClient
            questions={questions}
            themeName={themeName}
        />
    );
}
