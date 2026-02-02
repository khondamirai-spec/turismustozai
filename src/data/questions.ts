export interface ImageOption {
    id: string;
    image: string; // Using placeholder emojis or URLs for now
    label: string;
    isCorrect: boolean;
}

export interface TextQuestion {
    id: number;
    question: string;
    category: string;
    difficulty: "easy" | "medium" | "hard";
    options: ImageOption[];
}

export interface QuizCategory {
    id: string;
    title: string;
    image: string;
    viewCount: string;
    author: {
        name: string;
        avatar: string;
    };
    description: string;
}

export const quizCategories: QuizCategory[] = [
    {
        id: 'landmarks',
        title: 'Famous Landmarks',
        image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800&auto=format&fit=crop',
        viewCount: '3.7k',
        author: {
            name: 'Alex Travel',
            avatar: 'https://i.pravatar.cc/150?u=alex'
        },
        description: 'Test your knowledge on the world\'s most iconic structures.'
    },
    {
        id: 'food',
        title: 'Global Cuisine',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop',
        viewCount: '2.3k',
        author: {
            name: 'Chef Maria',
            avatar: 'https://i.pravatar.cc/150?u=maria'
        },
        description: 'How well do you know traditional dishes from around the world?'
    },
    {
        id: 'nature',
        title: 'Natural Wonders',
        image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&auto=format&fit=crop',
        viewCount: '1.4k',
        author: {
            name: 'Eco Tom',
            avatar: 'https://i.pravatar.cc/150?u=tom'
        },
        description: 'Explore the beauty of nature through this challenging quiz.'
    },
    {
        id: 'space',
        title: 'Space & Aliens',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
        viewCount: '5.2k',
        author: {
            name: 'Astronut',
            avatar: 'https://i.pravatar.cc/150?u=astro'
        },
        description: 'Journey to the stars and beyond.'
    }
];

export const textQuestions: TextQuestion[] = [
    {
        id: 1,
        question: "Which famous landmark is known as 'The Iron Lady'?",
        category: "landmarks",
        difficulty: "easy",
        options: [
            {
                id: 'a',
                image: '🗼', // Placeholder
                label: 'Eiffel Tower',
                isCorrect: true
            },
            {
                id: 'b',
                image: '🗽', // Placeholder
                label: 'Statue of Liberty',
                isCorrect: false
            },
            {
                id: 'c',
                image: '🕰️', // Placeholder
                label: 'Big Ben',
                isCorrect: false
            },
            {
                id: 'd',
                image: '🏟️', // Placeholder
                label: 'Colosseum',
                isCorrect: false
            }
        ]
    },
    {
        id: 2,
        question: "Which city is known as the 'City of Canals'?",
        category: "landmarks",
        difficulty: "easy",
        options: [
            {
                id: 'a',
                image: '🏛️',
                label: 'Athens',
                isCorrect: false
            },
            {
                id: 'b',
                image: '🌉',
                label: 'Venice',
                isCorrect: true
            },
            {
                id: 'c',
                image: '🗼',
                label: 'Paris',
                isCorrect: false
            },
            {
                id: 'd',
                image: '🕌',
                label: 'Istanbul',
                isCorrect: false
            }
        ]
    }
];

