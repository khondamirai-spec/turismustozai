"use client";

import { useState } from "react";
import { ArrowLeft, CheckCircle, XCircle, Trophy, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Option {
    id: number;
    image_url: string;
    label: string;
    is_correct: boolean;
}

interface Question {
    id: number;
    question_text: string;
    options: Option[];
}

interface QuizClientProps {
    questions: Question[];
    categoryName: string;
}

export default function QuizClient({ questions, categoryName }: QuizClientProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isQuizFinished, setIsQuizFinished] = useState(false);

    const currentQuestion = questions[currentIndex];
    // Ensure options are shuffled or fixed? User didn't specify. Assuming fixed for now.

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
                    <h2 className="text-2xl font-bold mb-4">No Questions Found</h2>
                    <p className="text-indigo-100 mb-6">Sorry, there are no questions available for this category yet.</p>
                    <Link href="/text-quiz" className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                        Go Back
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
                    <h2 className="text-3xl font-extrabold mb-2">Quiz Completed!</h2>
                    <p className="text-indigo-100 mb-6">You successfully finished the {categoryName} quiz.</p>

                    <div className="bg-white/10 rounded-xl p-4 mb-8">
                        <p className="text-sm uppercase tracking-widest text-indigo-200 mb-1">Your Score</p>
                        <p className="text-5xl font-black">{score} <span className="text-2xl text-white/50">/ {questions.length}</span></p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button onClick={restartQuiz} className="w-full flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors">
                            <RefreshCw size={20} /> Restart Quiz
                        </button>
                        <Link href="/text-quiz" className="w-full flex items-center justify-center gap-2 bg-indigo-700/50 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors border border-indigo-500/30">
                            <ArrowLeft size={20} /> Choose Another Topic
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col p-6 font-sans text-white">
            {/* Header */}
            <header className="flex items-center mb-6 justify-between">
                <Link
                    href="/text-quiz"
                    className="flex items-center text-indigo-100 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20"
                >
                    <ArrowLeft size={18} className="mr-1" />
                </Link>
                <div className="font-bold text-sm bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 line-clamp-1 max-w-[150px]">
                    {categoryName}
                </div>
                <div className="w-8"></div>
            </header>

            {/* Progress */}
            <div className="mb-8 flex justify-between items-center px-2">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-indigo-200 mb-1">Question</span>
                    <span className="text-2xl font-black">
                        {currentIndex + 1} <span className="text-white/40 text-lg">/ {questions.length}</span>
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-indigo-200 mb-1">Score</span>
                    <span className="text-2xl font-black text-white">{score}</span>
                </div>
            </div>

            {/* Question */}
            <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center leading-tight drop-shadow-md min-h-[80px] flex items-center justify-center">
                    {currentQuestion.question_text}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {currentQuestion.options.map((option) => {
                        const isSelected = selectedOptionId === option.id;
                        const isCorrect = option.is_correct;

                        let cardClasses = "group relative bg-white/10 border border-white/20 rounded-2xl p-2 transition-all duration-200 aspect-square flex flex-col items-center justify-center overflow-hidden active:scale-95 cursor-pointer hover:bg-white/20";

                        if (isAnswered) {
                            if (isSelected && isCorrect) {
                                cardClasses = "bg-green-500/20 border-green-500 ring-4 ring-green-500/30 rounded-2xl p-2 aspect-square flex flex-col items-center justify-center overflow-hidden";
                            } else if (isSelected && !isCorrect) {
                                cardClasses = "bg-red-500/20 border-red-500 ring-4 ring-red-500/30 rounded-2xl p-2 aspect-square flex flex-col items-center justify-center overflow-hidden";
                            } else if (!isSelected && isCorrect) {
                                cardClasses = "bg-green-500/20 border-green-500 rounded-2xl p-2 aspect-square flex flex-col items-center justify-center overflow-hidden opacity-100";
                            } else {
                                cardClasses = "bg-white/5 border-white/10 rounded-2xl p-2 aspect-square flex flex-col items-center justify-center overflow-hidden opacity-50";
                            }
                        }

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleOptionSelect(option)}
                                disabled={isAnswered}
                                className={cardClasses}
                            >
                                <div className="w-full h-full relative rounded-xl overflow-hidden mb-2">
                                    {/* Use standard img tag for simplicity with external URLs, or Next Image if configured */}
                                    <img src={option.image_url} alt={option.label} className="w-full h-full object-cover" />

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
                                    <span className="font-bold text-white text-xs md:text-sm uppercase tracking-wider text-center line-clamp-1">
                                        {option.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-auto mb-6">
                    <button
                        onClick={handleNextQuestion}
                        disabled={!isAnswered}
                        className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300
                ${isAnswered
                                ? "bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg transform hover:-translate-y-1"
                                : "bg-white/10 border border-white/20 text-indigo-300 cursor-not-allowed opacity-50"}
            `}
                    >
                        {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                    </button>
                </div>
            </div>
        </div>
    );
}
