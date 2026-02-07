
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://ttgjrmnxxaddflnscwyi.supabase.co';
const supabaseKey = fs.readFileSync('.env.local', 'utf8').match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1].trim();
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadData() {
    const data = JSON.parse(fs.readFileSync('scripts/new_modules_data.json', 'utf8'));

    // Group by Question to avoid duplicate entries in quiz_questions
    const questionsMap = new Map();
    data.forEach(item => {
        const key = `${item.module}|${item.savol}`;
        if (!questionsMap.has(key)) {
            questionsMap.set(key, {
                module: item.module,
                question_text: item.question_text,
                question_number: item.savol,
                options: []
            });
        }
        questionsMap.get(key).options.push({
            option_text: item.option_text,
            image_url: item.image_url,
            is_correct: item.is_correct
        });
    });

    console.log(`Processing ${questionsMap.size} questions...`);

    for (const [key, qData] of questionsMap.entries()) {
        try {
            // 1. Insert Question
            const { data: question, error: qError } = await supabase
                .from('quiz_questions')
                .insert({
                    module: qData.module,
                    question_text: qData.question_text,
                    question_number: qData.question_number
                })
                .select()
                .single();

            if (qError) throw qError;

            // 2. Insert Options
            const optionsToInsert = qData.options.map(opt => ({
                question_id: question.id,
                option_text: opt.option_text,
                image_url: opt.image_url,
                is_correct: opt.is_correct
            }));

            const { error: oError } = await supabase
                .from('quiz_options')
                .insert(optionsToInsert);

            if (oError) throw oError;

            console.log(`Uploaded Question: ${qData.module} - ${qData.question_number}`);
        } catch (err) {
            console.error(`Error uploading ${key}:`, err.message);
        }
    }
    console.log('Upload complete.');
}

uploadData();
