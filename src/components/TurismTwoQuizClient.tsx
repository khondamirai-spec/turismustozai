"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, XCircle, Trophy, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Option {
    id: string;
    image_url: string;
    label: string;
    is_correct: boolean;
}

interface Question {
    id: string;
    question_text: string;
    options: Option[];
}

interface TurismTwoQuizClientProps {
    questions: Question[];
    themeName: string;
}

export default function TurismTwoQuizClient({ questions, themeName }: TurismTwoQuizClientProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const currentQuestion = questions[currentIndex];

    const handleOptionSelect = (option: Option) => {
        if (isAnswered) return;

        setSelectedOptionId(option.id);
        setIsAnswered(true);

        if (option.is_correct) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOptionId(null);
            setIsAnswered(false);
        } else {
            setIsQuizFinished(true);
        }
    };

    const restartQuiz = () => {
        setCurrentIndex(0);
        setScore(0);
        setSelectedOptionId(null);
        setIsAnswered(false);
        setIsQuizFinished(false);
    };

    if (questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white p-6">
                <div className="bg-white/10 p-8 rounded-2xl border border-white/20 text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4">Savollar topilmadi</h2>
                    <p className="text-indigo-100 mb-6">Kechirasiz, ushbu mavzu uchun hali savollar mavjud emas.</p>
                    <Link href="/turism-2" className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                        Orqaga qaytish
                    </Link>
                </div>
            </div>
        );
    }

    if (isQuizFinished) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white p-6">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 text-center max-w-sm w-full shadow-2xl">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-yellow-400 p-4 rounded-full shadow-lg animate-bounce">
                            <Trophy size={48} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-extrabold mb-2">Viktorina yakunlandi!</h2>
                    <p className="text-indigo-100 mb-6">Siz {themeName} viktorinasini muvaffaqiyatli yakunladingiz.</p>

                    <div className="bg-white/10 rounded-xl p-4 mb-8">
                        <p className="text-sm uppercase tracking-widest text-indigo-200 mb-1">Sizning natijangiz</p>
                        <p className="text-5xl font-black">{score} <span className="text-2xl text-white/50">/ {questions.length}</span></p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button onClick={restartQuiz} className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors">
                            <RefreshCw size={20} /> Viktorinani qayta boshlash
                        </button>
                        <Link href="/turism-2" className="w-full flex items-center justify-center gap-2 bg-indigo-700/50 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors border border-indigo-500/30">
                            <ArrowLeft size={20} /> Boshqa mavzu tanlash
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col p-6 font-sans text-white">
            {/* Header / Top Bar */}
            <header className="flex items-center justify-between mb-8 bg-white/5 backdrop-blur-md p-3 rounded-3xl border border-white/10 shadow-lg">
                <div className="flex items-center gap-3 lg:gap-4 ml-1">
                    <Link
                        href="/turism-2"
                        className="flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-all w-10 h-10 rounded-full border border-white/20"
                    >
                        <ArrowLeft size={18} />
                    </Link>

                    <div className="flex flex-col leading-none ml-1 lg:ml-2">
                        <span className="text-[9px] lg:text-[11px] uppercase tracking-tighter text-indigo-200 mb-0.5 opacity-70">Savol</span>
                        <div className="font-black text-sm lg:text-lg">
                            {currentIndex + 1}<span className="text-indigo-300/60 font-medium scale-95 lg:scale-100 inline-block ml-0.5">/{questions.length}</span>
                        </div>
                    </div>
                </div>

                <div className="mx-2 flex-1 flex justify-center overflow-hidden">
                    <div className="px-5 py-2 lg:py-2.5 bg-white/10 rounded-2xl border border-white/10 font-bold text-[13px] lg:text-base tracking-tight whitespace-nowrap overflow-hidden text-ellipsis shadow-inner">
                        {themeName}
                    </div>
                </div>

                <div className="flex flex-col items-end leading-none mr-2 lg:mr-6">
                    <span className="text-[9px] lg:text-[11px] uppercase tracking-tighter text-indigo-200 mb-0.5 opacity-70">Natija</span>
                    <div className="font-black text-sm lg:text-xl text-white mr-1">
                        {score}
                    </div>
                </div>
            </header>

            {/* Question */}
            <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold mb-4 lg:mb-6 text-center leading-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] min-h-[60px] lg:min-h-0 flex items-center justify-center">
                    {currentQuestion.question_text}
                </h2>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 mb-6 lg:mb-8">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const isCorrect = option.is_correct;

                        let cardClasses = "group relative bg-white/10 border border-white/20 rounded-2xl p-2 transition-all duration-200 flex flex-col items-center justify-between overflow-hidden active:scale-95 cursor-pointer hover:bg-white/20 h-full shadow-lg";

                        if (isAnswered) {
                            if (isSelected && isCorrect) {
                                cardClasses = "bg-green-500/20 border-green-500 ring-4 ring-green-500/30 rounded-2xl p-2 flex flex-col items-center justify-between overflow-hidden h-full shadow-lg";
                            } else if (isSelected && !isCorrect) {
                                cardClasses = "bg-red-500/20 border-red-500 ring-4 ring-red-500/30 rounded-2xl p-2 flex flex-col items-center justify-between overflow-hidden h-full shadow-lg";
                            } else if (!isSelected && isCorrect) {
                                cardClasses = "bg-green-500/20 border-green-500 rounded-2xl p-2 flex flex-col items-center justify-between overflow-hidden opacity-100 h-full shadow-lg";
                            } else {
                                cardClasses = "bg-white/5 border-white/10 rounded-2xl p-2 flex flex-col items-center justify-between overflow-hidden opacity-50 h-full";
                            }
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option)}
                                disabled={isAnswered}
                                className={cardClasses}
                            >
                                <div className="w-full aspect-[3/4] relative rounded-xl overflow-hidden mb-2 shrink-0">
                                    {option.image_url ? (
                                        <img src={option.image_url} alt={option.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full bg-indigo-900/40 flex items-center justify-center text-white/20 font-bold text-4xl">
                                            ?
                                        </div>
                                    )}

                                    {isAnswered && isCorrect && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <CheckCircle className="text-green-400 w-12 h-12 shadow-lg" fill="currentColor" stroke="black" />
                                        </div>
                                    )}
                                    {isAnswered && isSelected && !isCorrect && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <XCircle className="text-red-500 w-12 h-12 shadow-lg" fill="currentColor" stroke="black" />
                                        </div>
                                    )}
                                </div>
                                {option.label && (
                                    <span className="font-semibold text-white text-[11px] md:text-sm tracking-tight text-center line-clamp-2 leading-tight min-h-[2.5em] flex items-center justify-center w-full px-1">
                                        {option.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto mb-4 lg:mb-6 flex justify-center">
                    <button
                        onClick={handleNextQuestion}
                        disabled={!isAnswered}
                        className={`w-full lg:max-w-md py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300
                ${isAnswered
                                ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg transform hover:-translate-y-1"
                                : "bg-white/10 border border-white/20 text-indigo-300 cursor-not-allowed opacity-50"}
            `}
                    >
                        {currentIndex === questions.length - 1 ? "Yakunlash" : "Keyingi savol"}
                    </button>
                </div>
            </div>
        </div>
    );
}
