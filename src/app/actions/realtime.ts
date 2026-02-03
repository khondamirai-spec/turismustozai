'use server';

export async function getRealtimeSession() {
    const apiKey = process.env.OPENAI_API_KEY;
    const promptId = process.env.NEXT_PUBLIC_OPENAI_PROMPT_ID;
    const promptVersion = process.env.NEXT_PUBLIC_OPENAI_PROMPT_VERSION;

    if (!apiKey) {
        throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'gpt-4o-realtime-preview',
            voice: 'marin',
            prompt: {
                id: promptId,
                version: promptVersion,
            },
            input_audio_transcription: {
                model: 'gpt-4o-mini-transcribe'
            },
            turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 500
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create session: ${JSON.stringify(error)}`);
    }

    return await response.json();
}
