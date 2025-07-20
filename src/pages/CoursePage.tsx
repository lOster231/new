import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, Clock, Users, Star, BookOpen, Trophy, Target, ArrowRight, ArrowLeft, RotateCcw, Zap, Brain, Code, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleNetwork from '../components/ParticleNetwork';
import { useAuth } from '../context/AuthContext';
import { getCourseById, Lesson } from '../data/mockData';

// Interactive Learning Components
const QuizComponent: React.FC<{ lesson: Lesson; onComplete: () => void }> = ({ lesson, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const questions = [
        {
            question: "What is the correct way to declare a variable in C++?",
            options: ["var x = 5;", "int x = 5;", "x = 5;", "declare x = 5;"],
            correct: 1
        },
        {
            question: "Which header file is needed for input/output operations?",
            options: ["<stdio.h>", "<iostream>", "<input.h>", "<output.h>"],
            correct: 1
        },
        {
            question: "What does 'cout' stand for?",
            options: ["Character output", "Console output", "Computer output", "Code output"],
            correct: 1
        }
    ];

    const handleAnswer = (answerIndex: number) => {
        setSelectedAnswer(answerIndex);
        if (answerIndex === questions[currentQuestion].correct) {
            setScore(score + 1);
        }
        
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
            } else {
                setShowResult(true);
            }
        }, 1000);
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setScore(0);
        setShowResult(false);
    };

    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 70;

        return (
            <div className="text-center space-y-6">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${passed ? 'bg-green-500/20' : 'bg-red-500/20'} mb-4`}>
                    {passed ? <Trophy className="h-10 w-10 text-green-400" /> : <RotateCcw className="h-10 w-10 text-red-400" />}
                </div>
                <h3 className="text-2xl font-bold text-white">Quiz Complete!</h3>
                <p className="text-gray-300">You scored {score} out of {questions.length} ({percentage}%)</p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={resetQuiz}
                        className="bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-200"
                    >
                        Try Again
                    </button>
                    {passed && (
                        <button
                            onClick={onComplete}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
                        >
                            Complete Lesson
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Question {currentQuestion + 1} of {questions.length}</h3>
                <div className="text-sm text-gray-400">Score: {score}/{currentQuestion}</div>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
            </div>

            <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-6">{questions[currentQuestion].question}</h4>
                <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                                selectedAnswer === null
                                    ? 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                                    : selectedAnswer === index
                                    ? index === questions[currentQuestion].correct
                                        ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                        : 'bg-red-500/20 border-red-500/50 text-red-300'
                                    : index === questions[currentQuestion].correct
                                    ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                    : 'bg-white/5 border-white/20 text-gray-400'
                            }`}
                        >
                            <span className="text-white">{option}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const GameComponent: React.FC<{ lesson: Lesson; onComplete: () => void }> = ({ lesson, onComplete }) => {
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [currentChallenge, setCurrentChallenge] = useState(0);

    const challenges = [
        {
            question: "Fix this C++ code:",
            code: "int main() {\n  cout << \"Hello World\";\n  return 0;\n}",
            hint: "Missing header file",
            solution: "#include <iostream>\nusing namespace std;\n\nint main() {\n  cout << \"Hello World\";\n  return 0;\n}"
        },
        {
            question: "Complete the function:",
            code: "int add(int a, int b) {\n  // Your code here\n}",
            hint: "Return the sum of a and b",
            solution: "int add(int a, int b) {\n  return a + b;\n}"
        }
    ];

    useEffect(() => {
        if (timeLeft > 0 && gameState === 'playing') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setGameState('lost');
        }
    }, [timeLeft, gameState]);

    const handleSolve = () => {
        setScore(score + 100);
        if (currentChallenge < challenges.length - 1) {
            setCurrentChallenge(currentChallenge + 1);
        } else {
            setGameState('won');
        }
    };

    if (gameState === 'won') {
        return (
            <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/20 rounded-2xl mb-4">
                    <Trophy className="h-10 w-10 text-yellow-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Congratulations!</h3>
                <p className="text-gray-300">You completed all challenges with a score of {score}!</p>
                <button
                    onClick={onComplete}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
                >
                    Complete Lesson
                </button>
            </div>
        );
    }

    if (gameState === 'lost') {
        return (
            <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-2xl mb-4">
                    <RotateCcw className="h-10 w-10 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Time's Up!</h3>
                <p className="text-gray-300">Don't worry, practice makes perfect!</p>
                <button
                    onClick={() => {
                        setGameState('playing');
                        setScore(0);
                        setTimeLeft(60);
                        setCurrentChallenge(0);
                    }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Coding Challenge {currentChallenge + 1}</h3>
                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-400">Score: {score}</div>
                    <div className={`text-sm font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-green-400'}`}>
                        Time: {timeLeft}s
                    </div>
                </div>
            </div>

            <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4">{challenges[currentChallenge].question}</h4>
                
                <div className="bg-black/50 rounded-xl p-4 mb-4 font-mono text-sm">
                    <pre className="text-green-400 whitespace-pre-wrap">{challenges[currentChallenge].code}</pre>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                        <Brain className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-400 font-medium">Hint:</span>
                    </div>
                    <p className="text-gray-300 text-sm">{challenges[currentChallenge].hint}</p>
                </div>

                <button
                    onClick={handleSolve}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2"
                >
                    <Zap className="h-4 w-4" />
                    <span>Submit Solution</span>
                </button>
            </div>
        </div>
    );
};

const CodingComponent: React.FC<{ lesson: Lesson; onComplete: () => void }> = ({ lesson, onComplete }) => {
    const [code, setCode] = useState('// Write your C++ code here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const runCode = async () => {
        setIsRunning(true);
        // Simulate code execution
        await new Promise(resolve => setTimeout(resolve, 1500));
        setOutput('Hello World!\nProgram executed successfully.');
        setIsRunning(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">Interactive Coding Exercise</h3>
                <button
                    onClick={onComplete}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm"
                >
                    Mark Complete
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Code Editor</h4>
                    <div className="bg-black/50 rounded-xl border border-white/20 overflow-hidden">
                        <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-400 text-sm ml-4">main.cpp</span>
                        </div>
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full h-64 bg-transparent text-green-400 font-mono text-sm p-4 resize-none focus:outline-none"
                            spellCheck={false}
                        />
                    </div>
                    <button
                        onClick={runCode}
                        disabled={isRunning}
                        className="mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
                    >
                        {isRunning ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Running...</span>
                            </>
                        ) : (
                            <>
                                <Play className="h-4 w-4" />
                                <span>Run Code</span>
                            </>
                        )}
                    </button>
                </div>

                <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Output</h4>
                    <div className="bg-black/50 rounded-xl border border-white/20 h-64 p-4 font-mono text-sm">
                        <pre className="text-gray-300 whitespace-pre-wrap">{output || 'Click "Run Code" to see output...'}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CoursePage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [course, setCourse] = useState(getCourseById(courseId || ''));

    useEffect(() => {
        if (!course) {
            navigate('/courses');
            return;
        }

        if (!user?.enrolledCourses.includes(course.id)) {
            navigate('/courses');
            return;
        }
    }, [course, user, navigate]);

    const handleCompleteLesson = () => {
        if (!course || !user) return;

        const updatedLessons = course.lessons.map((lesson, index) => 
            index === currentLessonIndex ? { ...lesson, completed: true } : lesson
        );

        const completedLessons = updatedLessons.filter(l => l.completed).length;
        const progress = Math.round((completedLessons / updatedLessons.length) * 100);

        // Update course progress
        setCourse(prev => prev ? { ...prev, lessons: updatedLessons, progress } : null);

        // Check if course is completed
        if (progress === 100 && !user.completedCourses.includes(course.id)) {
            updateUser({
                completedCourses: [...user.completedCourses, course.id],
                stats: {
                    ...user.stats,
                    coursesCompleted: user.stats.coursesCompleted + 1,
                    totalLearningHours: user.stats.totalLearningHours + 10 // Simulate hours
                }
            });
        }

        // Move to next lesson
        if (currentLessonIndex < course.lessons.length - 1) {
            setCurrentLessonIndex(currentLessonIndex + 1);
        }
    };

    const renderLessonContent = (lesson: Lesson) => {
        switch (lesson.type) {
            case 'quiz':
                return <QuizComponent lesson={lesson} onComplete={handleCompleteLesson} />;
            case 'game':
                return <GameComponent lesson={lesson} onComplete={handleCompleteLesson} />;
            case 'coding':
                return <CodingComponent lesson={lesson} onComplete={handleCompleteLesson} />;
            case 'video':
            case 'reading':
            default:
                return (
                    <div className="space-y-6">
                        <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center border border-white/20">
                            <div className="text-center">
                                <Play className="h-16 w-16 text-white/50 mx-auto mb-4" />
                                <p className="text-white/70">Video content would be displayed here</p>
                                <p className="text-gray-400 text-sm mt-2">Duration: {lesson.duration}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={handleCompleteLesson}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center space-x-2 mx-auto"
                            >
                                <CheckCircle className="h-5 w-5" />
                                <span>Mark as Complete</span>
                            </button>
                        </div>
                    </div>
                );
        }
    };

    if (!course || !user) {
        return null;
    }

    const currentLesson = course.lessons[currentLessonIndex];
    const completedLessons = course.lessons.filter(l => l.completed).length;
    const progress = Math.round((completedLessons / course.lessons.length) * 100);

    return (
        <div className="relative min-h-screen overflow-hidden">
            <ParticleNetwork />
            <Navbar />
            
            <div className="pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Course Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4 mb-6">
                            <button
                                onClick={() => navigate('/courses')}
                                className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                                <p className="text-gray-300">{course.instructor}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="glass-morphism rounded-2xl p-6 border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">Course Progress</h2>
                                <span className="text-2xl font-bold text-indigo-400">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                                <div 
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                                <span>{completedLessons} of {course.lessons.length} lessons completed</span>
                                <span>{course.duration} total</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Lesson Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="glass-morphism rounded-2xl p-6 border border-white/10 sticky top-24">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
                                    <BookOpen className="h-5 w-5 text-blue-400" />
                                    <span>Lessons</span>
                                </h3>
                                <div className="space-y-3">
                                    {course.lessons.map((lesson, index) => (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setCurrentLessonIndex(index)}
                                            className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                                                index === currentLessonIndex
                                                    ? 'bg-indigo-500/20 border border-indigo-500/30'
                                                    : 'bg-white/5 hover:bg-white/10 border border-white/10'
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    lesson.completed 
                                                        ? 'bg-green-500' 
                                                        : index === currentLessonIndex
                                                        ? 'bg-indigo-500'
                                                        : 'bg-gray-600'
                                                }`}>
                                                    {lesson.completed ? (
                                                        <CheckCircle className="h-4 w-4 text-white" />
                                                    ) : lesson.type === 'video' ? (
                                                        <Play className="h-3 w-3 text-white" />
                                                    ) : lesson.type === 'quiz' ? (
                                                        <Target className="h-3 w-3 text-white" />
                                                    ) : lesson.type === 'game' ? (
                                                        <Trophy className="h-3 w-3 text-white" />
                                                    ) : lesson.type === 'coding' ? (
                                                        <Code className="h-3 w-3 text-white" />
                                                    ) : (
                                                        <BookOpen className="h-3 w-3 text-white" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-white font-medium text-sm">{lesson.title}</div>
                                                    <div className="text-gray-400 text-xs flex items-center space-x-2">
                                                        <span>{lesson.duration}</span>
                                                        <span>•</span>
                                                        <span className="capitalize">{lesson.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="glass-morphism rounded-2xl p-8 border border-white/10">
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-white">{currentLesson.title}</h2>
                                        <div className="flex items-center space-x-2">
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                currentLesson.type === 'video' ? 'bg-blue-500/20 text-blue-400' :
                                                currentLesson.type === 'quiz' ? 'bg-purple-500/20 text-purple-400' :
                                                currentLesson.type === 'game' ? 'bg-yellow-500/20 text-yellow-400' :
                                                currentLesson.type === 'coding' ? 'bg-green-500/20 text-green-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                                {currentLesson.type.toUpperCase()}
                                            </div>
                                            <div className="text-sm text-gray-400">{currentLesson.duration}</div>
                                        </div>
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        Lesson {currentLessonIndex + 1} of {course.lessons.length}
                                    </div>
                                </div>

                                {renderLessonContent(currentLesson)}

                                {/* Navigation */}
                                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
                                    <button
                                        onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                                        disabled={currentLessonIndex === 0}
                                        className="flex items-center space-x-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        <span>Previous</span>
                                    </button>

                                    <div className="text-center">
                                        <div className="text-sm text-gray-400 mb-1">Progress</div>
                                        <div className="text-lg font-bold text-white">{currentLessonIndex + 1} / {course.lessons.length}</div>
                                    </div>

                                    <button
                                        onClick={() => setCurrentLessonIndex(Math.min(course.lessons.length - 1, currentLessonIndex + 1))}
                                        disabled={currentLessonIndex === course.lessons.length - 1}
                                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span>Next</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default CoursePage;