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
        .from('reception2.0')
        .select('*')
        .eq('mavzu', themeName)
        // We order by 'test' (question id) to group them efficiently, 
        // but 'test' is text (e.g. "1-test"), so sorting might be string-based in SQL.
        // We will sort correctly in JS.
        .order('test', { ascending: true });

    if (error) {
        console.error("Error fetching quiz data:", error);
        return <div className="p-6 text-white min-h-screen flex items-center justify-center">Viktorinani yuklashda xatolik.</div>;
    }

    if (!rows || rows.length === 0) {
        return <div className="p-6 text-white min-h-screen flex items-center justify-center">Ushbu mavzu bo'yicha savollar topilmadi.</div>;
    }

    // Group rows by question field
    const questionMap: { [key: string]: any } = {};
    rows.forEach((row, index) => {
        // 'test' is the question identifier (e.g. "1-test")
        const questionId = row.test;

        if (!questionMap[questionId]) {
            questionMap[questionId] = {
                id: questionId,
                question_text: row.test_text,
                options: []
            };
        }

        questionMap[questionId].options.push({
            id: `${questionId}-opt-${index}`, // Generate unique ID for option
            image_url: row.variant_rasm,
            label: row.variant_text,
            is_correct: row.togri_javob
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
