"use client";

import Link from "next/link";
import { ArrowLeft, Mic } from "lucide-react";
import { useState } from "react";

export default function VoiceQuizPage() {
    const [isListening, setIsListening] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col p-6 font-sans text-white">
            {/* Header */}
            <header className="flex items-center mb-8">
                <Link href="/" className="flex items-center text-indigo-100 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <ArrowLeft size={18} className="mr-2" />
                    <span className="font-semibold text-sm">Back</span>
                </Link>
            </header>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl w-full max-w-sm">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 transition-all duration-300 ${isListening ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] animate-pulse' : 'bg-white text-indigo-600'}`}>
                        <Mic size={40} className={isListening ? 'text-white' : ''} />
                    </div>

                    <h1 className="text-2xl font-black mb-2">Voice Quiz</h1>
                    <p className="text-indigo-100 text-sm mb-8 opacity-80">
                        Listen to the question and speak your answer clearly.
                    </p>

                    <button
                        onClick={() => setIsListening(!isListening)}
                        className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all transform active:scale-95 shadow-lg ${isListening ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
                    >
                        {isListening ? 'Stop Listening' : 'Start Speaking'}
                    </button>

                    <div className="mt-6 p-4 bg-black/20 rounded-xl">
                        <p className="text-xs text-indigo-200 uppercase tracking-widest mb-2 font-bold">Transcript</p>
                        <p className="text-sm italic opacity-70 min-h-[1.5rem]">
                            {isListening ? "Listening..." : "Press start to speak..."}
                        </p>
                    </div>
                </div>
            </div>

            <footer className="mt-8 text-center text-indigo-200 text-xs opacity-60">
                Voice recognition powered by AI
            </footer>
        </div>
    );
}
