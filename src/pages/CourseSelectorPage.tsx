import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Users, Star, Crown, Filter, Search, Play, CheckCircle, Lock, Target, Calendar, Plus, Trash2, Edit3 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleNetwork from '../components/ParticleNetwork';
import { useAuth } from '../context/AuthContext';
import { Course, UserGoal, GoalStep, getAvailableCoursesForUser, getCourseById } from '../data/mockData';

const CourseSelectorPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [editingGoal, setEditingGoal] = useState<UserGoal | null>(null);
    const [goalForm, setGoalForm] = useState({
        title: '',
        description: '',
        category: 'learning' as 'learning' | 'career' | 'project' | 'skill',
        startDate: '',
        endDate: '',
        isPublic: true,
        steps: [] as { title: string }[]
    });

    const availableCourses = user ? getAvailableCoursesForUser(user) : [];
    
    const filters = [
        { id: 'all', label: 'All Courses', count: availableCourses.length },
        { id: 'free', label: 'Free', count: availableCourses.filter(c => c.type === 'free').length },
        { id: 'premium', label: 'Premium', count: availableCourses.filter(c => c.type === 'premium').length },
        { id: 'enrolled', label: 'Enrolled', count: user?.enrolledCourses.length || 0 },
        { id: 'completed', label: 'Completed', count: user?.completedCourses.length || 0 },
    ];

    const filteredCourses = availableCourses.filter(course => {
        const matchesFilter = selectedFilter === 'all' || 
                             course.type === selectedFilter ||
                             (selectedFilter === 'enrolled' && user?.enrolledCourses.includes(course.id)) ||
                             (selectedFilter === 'completed' && user?.completedCourses.includes(course.id));
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleEnrollCourse = (courseId: string) => {
        if (!user) return;
        
        if (!user.enrolledCourses.includes(courseId)) {
            updateUser({
                enrolledCourses: [...user.enrolledCourses, courseId]
            });
        }
        
        navigate(`/course/${courseId}`);
    };

    const handleCreateGoal = () => {
        setEditingGoal(null);
        setGoalForm({
            title: '',
            description: '',
            category: 'learning',
            startDate: '',
            endDate: '',
            isPublic: true,
            steps: []
        });
        setShowGoalModal(true);
    };

    const handleEditGoal = (goal: UserGoal) => {
        setEditingGoal(goal);
        setGoalForm({
            title: goal.title,
            description: goal.description,
            category: goal.category,
            startDate: goal.startDate,
            endDate: goal.endDate,
            isPublic: goal.isPublic,
            steps: goal.steps.map(step => ({ title: step.title }))
        });
        setShowGoalModal(true);
    };

    const handleSaveGoal = () => {
        if (!user) return;

        const goalData: UserGoal = {
            id: editingGoal?.id || `goal_${Date.now()}`,
            title: goalForm.title,
            description: goalForm.description,
            category: goalForm.category,
            startDate: goalForm.startDate,
            endDate: goalForm.endDate,
            completed: editingGoal?.completed || false,
            isPublic: goalForm.isPublic,
            progress: editingGoal?.progress || 0,
            steps: goalForm.steps.map((step, index) => ({
                id: `step_${Date.now()}_${index}`,
                title: step.title,
                completed: false
            }))
        };

        let updatedGoals;
        if (editingGoal) {
            updatedGoals = user.goals.map(g => g.id === editingGoal.id ? goalData : g);
        } else {
            updatedGoals = [...user.goals, goalData];
        }

        updateUser({ goals: updatedGoals });
        setShowGoalModal(false);
    };

    const handleDeleteGoal = (goalId: string) => {
        if (!user) return;
        const updatedGoals = user.goals.filter(g => g.id !== goalId);
        updateUser({ goals: updatedGoals });
    };

    const handleToggleGoalStep = (goalId: string, stepId: string) => {
        if (!user) return;
        
        const updatedGoals = user.goals.map(goal => {
            if (goal.id === goalId) {
                const updatedSteps = goal.steps.map(step => {
                    if (step.id === stepId) {
                        return {
                            ...step,
                            completed: !step.completed,
                            completedAt: !step.completed ? new Date().toISOString() : undefined
                        };
                    }
                    return step;
                });
                
                const completedSteps = updatedSteps.filter(s => s.completed).length;
                const progress = Math.round((completedSteps / updatedSteps.length) * 100);
                const completed = progress === 100;
                
                return {
                    ...goal,
                    steps: updatedSteps,
                    progress,
                    completed
                };
            }
            return goal;
        });
        
        updateUser({ goals: updatedGoals });
    };

    const addGoalStep = () => {
        setGoalForm(prev => ({
            ...prev,
            steps: [...prev.steps, { title: '' }]
        }));
    };

    const removeGoalStep = (index: number) => {
        setGoalForm(prev => ({
            ...prev,
            steps: prev.steps.filter((_, i) => i !== index)
        }));
    };

    const updateGoalStep = (index: number, title: string) => {
        setGoalForm(prev => ({
            ...prev,
            steps: prev.steps.map((step, i) => i === index ? { title } : step)
        }));
    };

    if (!user) {
        navigate('/');
        return null;
    }

    return (
        <div className="relative min-h-screen overflow-hidden">
            <ParticleNetwork />
            <Navbar />
            
            <div className="pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-3 glass-morphism rounded-full px-8 py-4 mb-8 border border-white/20 shadow-lg">
                            <BookOpen className="h-6 w-6 text-blue-400 animate-pulse" />
                            <span className="text-white font-bold text-lg">Course Selection</span>
                            <Target className="h-6 w-6 text-green-400" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                            Choose Your
                            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent"> 
                                Learning Path
                            </span>
                        </h1>
                        <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                            Select courses that match your goals and start your journey to mastering C++ programming.
                        </p>
                    </div>

                    {/* Goals Section */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                                <Target className="h-6 w-6 text-green-400" />
                                <span>Your Learning Goals</span>
                            </h2>
                            <button
                                onClick={handleCreateGoal}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Add Goal</span>
                            </button>
                        </div>

                        {user.goals.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {user.goals.map(goal => (
                                    <div key={goal.id} className="glass-morphism rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white mb-2">{goal.title}</h3>
                                                <p className="text-gray-300 text-sm mb-3">{goal.description}</p>
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        goal.category === 'learning' ? 'bg-blue-500/20 text-blue-400' :
                                                        goal.category === 'career' ? 'bg-purple-500/20 text-purple-400' :
                                                        goal.category === 'project' ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-green-500/20 text-green-400'
                                                    }`}>
                                                        {goal.category}
                                                    </span>
                                                    {goal.isPublic && (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
                                                            Public
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleEditGoal(goal)}
                                                    className="p-2 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGoal(goal.id)}
                                                    className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm text-gray-300 mb-2">
                                                <span>Progress</span>
                                                <span>{goal.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div 
                                                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${goal.progress}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Goal Steps */}
                                        <div className="space-y-2">
                                            {goal.steps.map(step => (
                                                <div key={step.id} className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleToggleGoalStep(goal.id, step.id)}
                                                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                                            step.completed 
                                                                ? 'bg-green-500 border-green-500' 
                                                                : 'border-gray-400 hover:border-green-400'
                                                        }`}
                                                    >
                                                        {step.completed && <CheckCircle className="h-3 w-3 text-white" />}
                                                    </button>
                                                    <span className={`text-sm ${step.completed ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                                                        {step.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Dates */}
                                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                                            <span>Start: {new Date(goal.startDate).toLocaleDateString()}</span>
                                            <span>End: {new Date(goal.endDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 glass-morphism rounded-2xl border border-white/10">
                                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Goals Set</h3>
                                <p className="text-gray-500 mb-6">Create your first learning goal to track your progress</p>
                                <button
                                    onClick={handleCreateGoal}
                                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                                >
                                    Create Your First Goal
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-12">
                        <div className="relative max-w-2xl mx-auto mb-8">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search courses, instructors, or categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-400 transition-colors duration-200"
                            />
                        </div>

                        <div className="flex flex-wrap justify-center gap-3">
                            {filters.map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setSelectedFilter(filter.id)}
                                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center space-x-2 ${
                                        selectedFilter === filter.id
                                            ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                                            : 'bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 border border-white/20'
                                    }`}
                                >
                                    <span>{filter.label}</span>
                                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">{filter.count}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Courses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map(course => {
                            const isEnrolled = user.enrolledCourses.includes(course.id);
                            const isCompleted = user.completedCourses.includes(course.id);
                            const canAccess = course.type === 'free' || 
                                            user.group === 'Premium Plan' || 
                                            ['Owner', 'Admin', 'Senior Support', 'Support', 'Junior Support'].includes(user.group);

                            return (
                                <div key={course.id} className="glass-morphism rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-2 group">
                                    <div className="relative h-48">
                                        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                                        
                                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 backdrop-blur-sm">
                                            {course.level}
                                        </div>
                                        
                                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 backdrop-blur-sm ${
                                            course.type === 'premium' 
                                                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' 
                                                : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                                        }`}>
                                            {course.type === 'premium' && <Crown className="h-3 w-3" />}
                                            <span>{course.type.toUpperCase()}</span>
                                        </div>

                                        {isCompleted && (
                                            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 backdrop-blur-sm flex items-center space-x-1">
                                                <CheckCircle className="h-3 w-3" />
                                                <span>COMPLETED</span>
                                            </div>
                                        )}

                                        {!canAccess && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                                                <div className="text-center">
                                                    <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                    <span className="text-gray-300 text-sm font-medium">Premium Required</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-4">
                                            <div className="text-sm font-medium mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                                {course.category}
                                            </div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors duration-200 mb-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {course.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex items-center space-x-1">
                                                    <Clock className="h-4 w-4" />
                                                    <span>{course.duration}</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <Users className="h-4 w-4" />
                                                    <span>{course.students.toLocaleString()}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                <span className="text-white font-medium">{course.rating}</span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-400 mb-4">
                                            Instructor: <span className="text-white">{course.instructor}</span>
                                        </div>

                                        <button
                                            onClick={() => canAccess ? handleEnrollCourse(course.id) : null}
                                            disabled={!canAccess}
                                            className={`w-full py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                                                !canAccess 
                                                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' 
                                                    : isCompleted
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                                    : isEnrolled
                                                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
                                                    : course.type === 'premium'
                                                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg hover:shadow-yellow-500/25'
                                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                                            }`}
                                        >
                                            {!canAccess ? (
                                                <>
                                                    <Lock className="h-4 w-4" />
                                                    <span>Premium Required</span>
                                                </>
                                            ) : isCompleted ? (
                                                <>
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Review Course</span>
                                                </>
                                            ) : isEnrolled ? (
                                                <>
                                                    <Play className="h-4 w-4" />
                                                    <span>Continue Learning</span>
                                                </>
                                            ) : (
                                                <>
                                                    {course.type === 'premium' && <Crown className="h-4 w-4" />}
                                                    <span>{course.type === 'premium' ? 'Enroll Premium' : 'Start Free'}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Courses Found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                    )}
                </div>

                {/* Goal Modal */}
                {showGoalModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
                        <div className="glass-morphism rounded-3xl border border-white/20 w-full max-w-2xl shadow-2xl animate-fade-in">
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    {editingGoal ? 'Edit Goal' : 'Create New Goal'}
                                </h2>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">Goal Title</label>
                                        <input
                                            type="text"
                                            value={goalForm.title}
                                            onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                            placeholder="Enter your goal title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-300 mb-2">Description</label>
                                        <textarea
                                            value={goalForm.description}
                                            onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                                            placeholder="Describe your goal"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2">Category</label>
                                            <select
                                                value={goalForm.category}
                                                onChange={(e) => setGoalForm(prev => ({ ...prev, category: e.target.value as any }))}
                                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                                            >
                                                <option value="learning">Learning</option>
                                                <option value="career">Career</option>
                                                <option value="project">Project</option>
                                                <option value="skill">Skill</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <input
                                                type="checkbox"
                                                id="isPublic"
                                                checked={goalForm.isPublic}
                                                onChange={(e) => setGoalForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                                                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                            />
                                            <label htmlFor="isPublic" className="text-white font-medium">
                                                Make goal public
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2">Start Date</label>
                                            <input
                                                type="date"
                                                value={goalForm.startDate}
                                                onChange={(e) => setGoalForm(prev => ({ ...prev, startDate: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-300 mb-2">End Date</label>
                                            <input
                                                type="date"
                                                value={goalForm.endDate}
                                                onChange={(e) => setGoalForm(prev => ({ ...prev, endDate: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="block text-sm font-bold text-gray-300">Goal Steps</label>
                                            <button
                                                onClick={addGoalStep}
                                                className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-sm hover:bg-blue-500/30 transition-colors duration-200 flex items-center space-x-1"
                                            >
                                                <Plus className="h-4 w-4" />
                                                <span>Add Step</span>
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            {goalForm.steps.map((step, index) => (
                                                <div key={index} className="flex items-center space-x-3">
                                                    <input
                                                        type="text"
                                                        value={step.title}
                                                        onChange={(e) => updateGoalStep(index, e.target.value)}
                                                        className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                                        placeholder={`Step ${index + 1}`}
                                                    />
                                                    <button
                                                        onClick={() => removeGoalStep(index)}
                                                        className="p-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end space-x-4 mt-8">
                                    <button
                                        onClick={() => setShowGoalModal(false)}
                                        className="px-6 py-3 text-gray-300 hover:text-white transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveGoal}
                                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                    >
                                        {editingGoal ? 'Update Goal' : 'Create Goal'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
};

export default CourseSelectorPage;