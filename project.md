# Tourism Quiz App - Complete Documentation

## 📋 Project Overview

A comprehensive tourism quiz application designed for tourists to test their knowledge about landmarks, cultures, and destinations worldwide. The app features two distinct quiz modes: text-based questions with image answers and voice-interactive quizzes.

---

## 🎯 Project Goals

- Create an engaging, interactive quiz experience for tourists
- Provide multiple quiz modes (text-based and voice-based)
- Implement real-time answer verification
- Deliver an intuitive and visually appealing user interface
- Support 30+ questions across various tourism topics

---

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     TOURISM QUIZ APP                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────┐        ┌────────────────────┐      │
│  │  Section 1:        │        │  Section 2:        │      │
│  │  Text Quiz         │        │  Voice Quiz        │      │
│  │  (Image Answers)   │        │  (Voice Q&A)       │      │
│  └────────────────────┘        └────────────────────┘      │
│                                          │                   │
└──────────────────────────────────────────┼──────────────────┘
                                           │
                                           ▼
                              ┌─────────────────────┐
                              │   Webhook Trigger   │
                              └─────────────────────┘
                                           │
                                           ▼
                              ┌─────────────────────┐
                              │      n8n Flow       │
                              └─────────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
         ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
         │  Gemini API      │   │   AI Agent       │   │  Webhook         │
         │  (Transcription) │   │  (Validation)    │   │  (Response)      │
         └──────────────────┘   └──────────────────┘   └──────────────────┘
```

---

## 📱 App Sections

### Section 1: Text-Based Quiz (Image Answers)

#### Description
Users read text questions and select answers from four image-based options.

#### Features
- **Question Format**: Text displayed at the top
- **Answer Format**: 4 image options in a grid layout
- **Total Questions**: 30 questions
- **Visual Feedback**: Immediate color-coded response (correct/incorrect)
- **Progress Tracking**: Question counter and progress bar
- **Score Display**: Real-time score updates

#### User Flow
```
Start Quiz → Read Question → View 4 Image Options → Select Answer 
→ Get Feedback → Next Question → ... → View Final Score
```

#### Technical Specifications

**Data Structure:**
```javascript
{
  id: number,
  question: string,
  options: [
    {
      id: string,
      image: string (URL or emoji),
      label: string,
      isCorrect: boolean
    }
  ]
}
```

**UI Components:**
- Question display card
- Image grid (2x2 layout)
- Progress indicator
- Score counter
- Navigation buttons

---

### Section 2: Voice-Interactive Quiz

#### Description
Users listen to spoken questions and respond with voice answers, verified by AI.

#### Features
- **Question Delivery**: Text-to-speech (auto-play or manual)
- **Answer Method**: Voice recording via microphone
- **Processing**: Real-time webhook integration
- **Validation**: AI-powered answer checking
- **Feedback**: Visual true/false indication

#### User Flow
```
Start Voice Quiz → Listen to Question (Auto-play) → Click Record Button 
→ Speak Answer → Stop Recording → Send to Webhook → Processing 
→ Receive True/False → Next Question → ... → View Results
```

#### Technical Specifications

**Audio Processing Pipeline:**
```
Voice Input → Browser Recording API → Audio Blob → Webhook Trigger 
→ n8n Workflow → Gemini Transcription → Text Output → AI Agent 
→ Validation → Webhook Response → UI Update
```

**Required APIs:**
- Web Audio API / MediaRecorder API (browser)
- Webhook endpoint (your custom URL)
- n8n workflow automation
- Gemini API (transcription)
- Custom AI Agent (validation)

**Data Flow:**
```javascript
// Outgoing to webhook
{
  questionId: number,
  audioBlob: Blob,
  timestamp: string
}

// Response from webhook
{
  isCorrect: boolean,
  transcription: string (optional),
  feedback: string (optional)
}
```

---

## 🎨 UI/UX Design Specifications

### Design Principles
- **Clean & Minimal**: Focus on content, reduce clutter
- **Responsive**: Mobile-first approach
- **Accessible**: High contrast, clear typography
- **Engaging**: Smooth animations and transitions
- **Intuitive**: Clear navigation and feedback

### Color Scheme
```css
Primary: #3B82F6 (Blue)
Success: #10B981 (Green)
Error: #EF4444 (Red)
Background: #F9FAFB (Light Gray)
Text: #1F2937 (Dark Gray)
Card: #FFFFFF (White)
```

### Typography
- **Headers**: 24-32px, Bold, Sans-serif
- **Questions**: 18-20px, Medium, Sans-serif
- **Answers**: 14-16px, Regular, Sans-serif
- **Buttons**: 16px, Semi-bold, Sans-serif

### Layout Components

#### Home Screen
```
┌─────────────────────────────────────┐
│         TOURISM QUIZ APP            │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   📝 Text Quiz                │ │
│  │   Answer with Images          │ │
│  │   [Start Quiz →]              │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   🎤 Voice Quiz               │ │
│  │   Speak Your Answers          │ │
│  │   [Start Quiz →]              │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### Text Quiz Screen
```
┌─────────────────────────────────────┐
│  Question 5/30        Score: 4/5    │
│  ████████░░░░░░░░░░░░░░░            │
├─────────────────────────────────────┤
│                                     │
│  Which city is known as the         │
│  "City of Canals"?                  │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │   🏛️     │  │   🌉     │        │
│  │  Athens  │  │  Venice  │        │
│  └──────────┘  └──────────┘        │
│                                     │
│  ┌──────────┐  ┌──────────┐        │
│  │   🗼     │  │   🕌     │        │
│  │  Paris   │  │  Istanbul│        │
│  └──────────┘  └──────────┘        │
│                                     │
│         [Next Question →]           │
└─────────────────────────────────────┘
```

#### Voice Quiz Screen
```
┌─────────────────────────────────────┐
│  🎤 Voice Question 3/30             │
│  ████████████░░░░░░░░░░░            │
├─────────────────────────────────────┤
│                                     │
│  🔊 [Play Question]                 │
│                                     │
│  "What is the capital city          │
│   of France?"                       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │         🎙️                  │   │
│  │   [Press to Record]         │   │
│  │                              │   │
│  └─────────────────────────────┘   │
│                                     │
│  Status: Ready to record            │
│                                     │
│  [Skip Question]                    │
└─────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### Frontend Stack

**Recommended Technologies:**
- **Framework**: React.js (with Hooks)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Audio**: Web Audio API / MediaRecorder API
- **HTTP Client**: Axios or Fetch API

### File Structure
```
tourism-quiz-app/
├── public/
│   ├── index.html
│   └── images/
│       └── landmarks/
├── src/
│   ├── components/
│   │   ├── Home.jsx
│   │   ├── TextQuiz.jsx
│   │   ├── VoiceQuiz.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── ImageOption.jsx
│   │   ├── VoiceRecorder.jsx
│   │   ├── ProgressBar.jsx
│   │   └── ScoreDisplay.jsx
│   ├── data/
│   │   └── questions.js
│   ├── utils/
│   │   ├── audioRecorder.js
│   │   ├── webhookService.js
│   │   └── scoreCalculator.js
│   ├── hooks/
│   │   ├── useAudioRecorder.js
│   │   └── useQuizState.js
│   ├── App.jsx
│   └── index.js
├── package.json
└── README.md
```

### Sample Question Data Structure

```javascript
// data/questions.js
export const textQuestions = [
  {
    id: 1,
    question: "Which famous landmark is known as 'The Iron Lady'?",
    category: "landmarks",
    difficulty: "easy",
    options: [
      {
        id: 'a',
        image: '/images/eiffel-tower.jpg',
        label: 'Eiffel Tower',
        isCorrect: true
      },
      {
        id: 'b',
        image: '/images/statue-liberty.jpg',
        label: 'Statue of Liberty',
        isCorrect: false
      },
      {
        id: 'c',
        image: '/images/big-ben.jpg',
        label: 'Big Ben',
        isCorrect: false
      },
      {
        id: 'd',
        image: '/images/colosseum.jpg',
        label: 'Colosseum',
        isCorrect: false
      }
    ]
  },
  // ... 29 more questions
];

export const voiceQuestions = [
  {
    id: 1,
    question: "What is the capital city of France?",
    audioUrl: "/audio/question-1.mp3",
    correctAnswers: ["Paris", "paris"],
    difficulty: "easy"
  },
  // ... more questions
];
```

---

## 🔌 Webhook Integration (n8n)

### Overview
The voice quiz section requires webhook integration for processing voice answers.

### Workflow Components

#### 1. Webhook Trigger (n8n)
- **Method**: POST
- **URL**: `https://your-n8n-instance.com/webhook/tourism-quiz`
- **Content-Type**: `multipart/form-data`

#### 2. Gemini API Node
- **Purpose**: Transcribe audio to text
- **Input**: Audio blob from webhook
- **Output**: Transcribed text string

#### 3. AI Agent Node
- **Purpose**: Validate answer correctness
- **Input**: Transcribed text + question ID
- **Process**: Compare against correct answers
- **Output**: Boolean (true/false)

#### 4. Response Webhook
- **Purpose**: Send result back to app
- **Output**: JSON response

### Webhook Request Format

```javascript
// POST request to webhook
const formData = new FormData();
formData.append('questionId', questionId);
formData.append('audio', audioBlob, 'answer.webm');
formData.append('timestamp', new Date().toISOString());

fetch('https://your-webhook-url.com/tourism-quiz', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  // Handle response
  console.log('Is correct:', data.isCorrect);
});
```

### Webhook Response Format

```javascript
{
  "success": true,
  "questionId": 1,
  "isCorrect": true,
  "transcription": "Paris",
  "feedback": "Correct! Paris is the capital of France.",
  "timestamp": "2026-02-02T10:30:00Z"
}
```

### n8n Workflow Diagram

```
┌─────────────┐
│  Webhook    │ (Receives audio + questionId)
│  Trigger    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Extract    │ (Get audio blob and metadata)
│  Data       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Gemini API │ (Transcribe audio → text)
│  Node       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Function   │ (Normalize text: lowercase, trim)
│  Node       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  AI Agent   │ (Check if answer matches correct answers)
│  Node       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Set        │ (Format response JSON)
│  Node       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Respond to │ (Send result back to app)
│  Webhook    │
└─────────────┘
```

---

## 📊 Features & Functionality

### Core Features

#### Text Quiz Mode
- [x] Display questions with text
- [x] Show 4 image-based answer options
- [x] Visual feedback on selection
- [x] Score tracking
- [x] Progress indicator
- [x] Navigation between questions
- [x] Final score screen
- [x] Restart quiz option

#### Voice Quiz Mode
- [x] Text-to-speech question playback
- [x] Voice recording capability
- [x] Webhook integration
- [x] Real-time answer validation
- [x] Visual feedback (true/false)
- [x] Progress tracking
- [x] Skip question option

#### Additional Features
- [x] Responsive design
- [x] Dark/light mode toggle (optional)
- [x] Category filtering
- [x] Difficulty levels
- [x] High score leaderboard (future)
- [x] Shareable results (future)

---

## 🎯 User Experience Flow

### First-Time User Journey

1. **Landing**: User opens app, sees two quiz mode options
2. **Selection**: User chooses Text Quiz or Voice Quiz
3. **Quiz Start**: Instructions displayed, quiz begins
4. **Question Loop**: User answers questions one by one
5. **Feedback**: Immediate visual feedback per answer
6. **Completion**: Final score displayed with summary
7. **Options**: Restart, try other mode, or exit

### Returning User Journey

1. **Welcome Back**: App remembers progress (optional)
2. **Continue**: Option to resume or start fresh
3. **Mode Switch**: Easy switching between quiz modes
4. **Progress**: Track improvement over time

---

## 🧪 Testing Strategy

### Unit Testing
- Test individual components (buttons, cards, recorders)
- Validate data structures
- Test utility functions

### Integration Testing
- Test webhook communication
- Verify audio recording and playback
- Test state management

### User Acceptance Testing
- Test on multiple devices (mobile, tablet, desktop)
- Verify accessibility features
- Test with real users for feedback

### Performance Testing
- Measure load times
- Test with 30 questions loaded
- Verify webhook response times

---

## 🚀 Deployment Plan

### Phase 1: MVP (Minimum Viable Product)
- ✅ Build Text Quiz section with 10 sample questions
- ✅ Create basic UI/UX
- ✅ Implement scoring system

### Phase 2: Voice Integration
- ⏳ Set up n8n webhook workflow
- ⏳ Integrate Gemini API
- ⏳ Build voice recording component
- ⏳ Test end-to-end voice flow

### Phase 3: Full Content
- ⏳ Add all 30 text questions with images
- ⏳ Add all voice questions
- ⏳ Implement category system

### Phase 4: Polish & Launch
- ⏳ Final UI/UX refinements
- ⏳ Performance optimization
- ⏳ Cross-browser testing
- ⏳ Deploy to production

---

## 📝 Sample Questions (30 Questions)

### Category: Landmarks (10 questions)
1. Which famous landmark is known as 'The Iron Lady'?
2. Where is the Statue of Liberty located?
3. Which ancient wonder is located in Egypt?
4. What is the tallest building in the world?
5. Where can you find the Leaning Tower?
6. Which landmark has Big Ben?
7. Where is the Taj Mahal located?
8. Which city is home to the Sydney Opera House?
9. Where is Machu Picchu located?
10. Which country has the Great Wall?

### Category: Geography (10 questions)
11. What is the capital of France?
12. Which continent is the largest?
13. What ocean is between America and Europe?
14. Which country has the most islands?
15. What is the longest river in the world?
16. Which desert is the largest?
17. What is the highest mountain?
18. Which country is both in Europe and Asia?
19. What sea is between Europe and Africa?
20. Which country has the most time zones?

### Category: Culture (10 questions)
21. Which city is known as the City of Love?
22. What is the traditional dress of Japan?
23. Which country invented pizza?
24. Where did yoga originate?
25. Which country is famous for flamenco dancing?
26. What is the national sport of Canada?
27. Which country celebrates Oktoberfest?
28. Where is the Running of the Bulls held?
29. Which country has the most UNESCO World Heritage sites?
30. What is the currency of the United Kingdom?

---

## 🛠️ Development Roadmap

### Week 1-2: Foundation
- Set up project structure
- Create basic components
- Implement routing
- Design UI mockups

### Week 3-4: Text Quiz
- Build question display
- Implement image options
- Add scoring system
- Create progress tracking

### Week 5-6: Voice Quiz
- Implement audio recording
- Set up webhook integration
- Configure n8n workflow
- Test Gemini transcription

### Week 7-8: Integration
- Connect all components
- Add navigation
- Implement state management
- Polish UI/UX

### Week 9-10: Testing & Deployment
- Comprehensive testing
- Bug fixes
- Performance optimization
- Production deployment

---

## 📚 Resources & References

### Documentation
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [n8n Documentation](https://docs.n8n.io)
- [Gemini API](https://ai.google.dev/gemini-api/docs)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

### Tools
- **Design**: Figma, Adobe XD
- **Development**: VS Code, Chrome DevTools
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel, Netlify, or custom server

---

## 🤝 Contributing

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- Use ESLint for JavaScript linting
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 📞 Support & Contact

For questions, issues, or suggestions:
- Email: support@tourismquizapp.com
- GitHub Issues: [repository-link]
- Documentation: [docs-link]

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🎉 Acknowledgments

- Tourism content contributors
- Open source libraries
- Beta testers
- Design inspiration

---

**Last Updated**: February 2, 2026  
**Version**: 1.0.0  
**Status**: In Development