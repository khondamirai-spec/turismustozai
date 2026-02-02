"use client";

import { textQuestions, quizCategories, QuizCategory } from "@/data/questions";
import Link from "next/link";
import { ArrowLeft, Play } from "lucide-react";
import { useState } from "react";

export default function TextQuizPage() {
    const [selectedCategory, setSelectedCategory] = useState<QuizCategory | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const filteredQuestions = selectedCategory
        ? textQuestions.filter(q => q.category === selectedCategory.id)
        : [];

    const currentQuestion = filteredQuestions[currentQuestionIndex];

    const handleCategorySelect = (category: QuizCategory) => {
        setSelectedCategory(category);
        setCurrentQuestionIndex(0);
    };

    const handleBackToCategories = () => {
        setSelectedCategory(null);
    };

    // Category Selection View
    if (!selectedCategory) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-6 font-sans text-white">
                <header className="flex items-center mb-8">
                    <Link href="/" className="flex items-center text-indigo-100 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                        <ArrowLeft size={18} className="mr-2" />
                        <span className="font-semibold text-sm">Back</span>
                    </Link>
                </header>

                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold mb-2 text-white">
                        Choose Topic
                    </h1>
                    <p className="text-indigo-100 text-sm opacity-80">
                        Select a category to start
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {quizCategories.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategorySelect(category)}
                            className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden active:scale-95 transition-all duration-200 cursor-pointer flex flex-col"
                        >
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src={category.image}
                                    alt={category.title}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h3 className="text-white font-bold text-sm leading-tight shadow-sm">
                                        {category.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // No Questions View
    if (filteredQuestions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col items-center justify-center p-6 text-white font-sans">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl text-center max-w-xs w-full">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Play size={32} className="text-white ml-1" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
                    <p className="text-indigo-100 text-sm mb-6 opacity-80">No questions in this category yet.</p>
                    <button
                        onClick={handleBackToCategories}
                        className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Quiz View
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex flex-col p-6 font-sans text-white">
            {/* Header */}
            <header className="flex items-center mb-6 justify-between">
                <button
                    onClick={handleBackToCategories}
                    className="flex items-center text-indigo-100 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-3 py-2 rounded-full border border-white/20"
                >
                    <ArrowLeft size={18} className="mr-1" />
                </button>
                <div className="font-bold text-sm bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    {selectedCategory.title}
                </div>
                <div className="w-8"></div> {/* Spacer for centering */}
            </header>

            {/* Progress */}
            <div className="mb-8 flex justify-between items-center px-2">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-indigo-200 mb-1">Question</span>
                    <span className="text-2xl font-black">
                        {currentQuestionIndex + 1} <span className="text-white/40 text-lg">/ {filteredQuestions.length}</span>
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase tracking-widest text-indigo-200 mb-1">Score</span>
                    <span className="text-2xl font-black text-white">0</span>
                </div>
            </div>

            {/* Question */}
            <div className="flex-1 flex flex-col">
                <h2 className="text-2xl font-bold mb-8 text-center leading-tight drop-shadow-md">
                    {currentQuestion.question}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    {currentQuestion.options.map((option) => (
                        <button
                            key={option.id}
                            className="group relative bg-white/10 hover:bg-white/20 border border-white/20 active:border-white/50 rounded-2xl p-4 transition-all duration-200 aspect-square flex flex-col items-center justify-center overflow-hidden active:scale-95"
                        >
                            <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                                {option.image}
                            </div>
                            <span className="font-bold text-white text-sm uppercase tracking-wider text-center">
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="mt-auto">
                    <button className="w-full bg-white/10 border border-white/20 text-indigo-200 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs cursor-not-allowed opacity-50">
                        Next Question
                    </button>
                </div>
            </div>
        </div>
    );
}
