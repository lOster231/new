import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Globe, Image, Lock, Loader, AlertCircle, Ban, MessageSquare, Mail, Crown, Calendar, MapPin, Edit, Eye, EyeOff, Star, Award, BookOpen, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleNetwork from '../components/ParticleNetwork';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://api.cpp-hub.com/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface PublicProfileData {
    id: number;
    username: string | null;
    name?: string;
    email?: string;
    bio: string | null;
    nationality: string | null;
    profile_picture_url: string | null;
    is_profile_public: boolean;
    group: string;
    banned_until?: string | null;
    ban_reason?: string | null;
    is_private?: boolean;
    message?: string;
}

const PublicProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user: currentUser, hasPrivilege } = useAuth();
    const [profile, setProfile] = useState<PublicProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTargetUserBanned, setIsTargetUserBanned] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError(null);
            setIsTargetUserBanned(false);
            try {
                const response = await apiClient.get(`/users/${id}/profile`);
                setProfile(response.data);
                if (response.data.banned_until) {
                    const bannedUntilDate = new Date(response.data.banned_until);
                    if (bannedUntilDate > new Date()) {
                        setIsTargetUserBanned(true);
                    }
                }
            } catch (err: any) {
                console.error('Failed to fetch public profile:', err);
                if (err.response?.status === 403) {
                    if (err.response?.data?.is_private) {
                        setError('This profile is private.');
                    } else if (err.response?.data?.message && err.response?.data?.banned_until) {
                        setIsTargetUserBanned(true);
                        setProfile({
                            id: 0,
                            username: id,
                            bio: null, nationality: null, profile_picture_url: null, is_profile_public: false, group: 'Unknown',
                            banned_until: err.response.data.banned_until,
                            ban_reason: err.response.data.ban_reason,
                            message: err.response.data.message
                        });
                        setError(null);
                    } else {
                        setError('Access Denied.');
                    }
                } else if (err.response?.status === 404) {
                    setError('User not found.');
                } else {
                    setError('Failed to load profile. Please try again later.');
                }
                setProfile(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id, currentUser]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="glass-morphism rounded-2xl p-8 border border-white/20 flex items-center space-x-4">
                    <Loader className="h-8 w-8 text-indigo-400 animate-spin" />
                    <p className="text-white text-lg">Loading profile...</p>
                </div>
            </div>
        );
    }

    const isOwner = currentUser && profile && currentUser.id === profile.id;
    const canSeeFullInfo = hasPrivilege(['Admin', 'Owner', 'Senior Support']);

    const getGroupColor = (group: string) => {
        switch (group) {
            case 'Owner': return 'from-red-500 to-orange-500';
            case 'Admin': return 'from-purple-500 to-pink-500';
            case 'Senior Support': return 'from-blue-500 to-cyan-500';
            case 'Support': return 'from-green-500 to-emerald-500';
            case 'Junior Support': return 'from-yellow-500 to-orange-500';
            case 'Premium Plan': return 'from-indigo-500 to-purple-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            <ParticleNetwork />
            <Navbar />
            
            <div className="pt-20 pb-16">
                {/* Enhanced Header */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center space-x-3 glass-morphism rounded-full px-8 py-4 mb-8 border border-white/20 shadow-lg">
                            <User className="h-6 w-6 text-blue-400" />
                            <span className="text-white font-bold text-lg">Member Profile</span>
                            <Eye className="h-6 w-6 text-green-400" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                            User
                            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent"> 
                                Profile
                            </span>
                        </h1>
                        <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                            Discover more about this C++ Hub community member.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="glass-morphism rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                        {error ? (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-2xl mb-6">
                                    <AlertCircle className="h-10 w-10 text-red-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">Profile Unavailable</h2>
                                <p className="text-red-400 text-lg mb-8">{error}</p>
                                
                                {isTargetUserBanned && profile && (
                                    <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 max-w-md mx-auto">
                                        <div className="flex items-center justify-center space-x-2 mb-3">
                                            <Ban className="h-5 w-5 text-red-400" />
                                            <h3 className="text-red-400 font-bold">User Banned</h3>
                                        </div>
                                        <p className="text-red-300 text-sm mb-2">Reason: {profile.ban_reason}</p>
                                        <p className="text-red-300 text-xs">Until: {profile.banned_until ? new Date(profile.banned_until).toLocaleString() : 'Permanent'}</p>
                                    </div>
                                )}
                                
                                <Link 
                                    to="/" 
                                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                                >
                                    <span>Back to Home</span>
                                </Link>
                            </div>
                        ) : profile ? (
                            <>
                                {/* Profile Header */}
                                <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 p-8 border-b border-white/10">
                                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                                        <div className="relative">
                                            <img
                                                src={profile.profile_picture_url || 'https://placehold.co/160x160/000000/FFFFFF?text=User'}
                                                alt={profile.username || 'User'}
                                                className="w-40 h-40 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
                                                onError={(e) => { e.currentTarget.src = 'https://placehold.co/160x160/000000/FFFFFF?text=User'; }}
                                            />
                                            {isTargetUserBanned && (
                                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                                                    <Ban className="h-4 w-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 text-center md:text-left space-y-4">
                                            <div>
                                                <h2 className="text-3xl font-bold text-white mb-2">
                                                    {profile.username || 'Anonymous User'}
                                                </h2>
                                                
                                                <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${getGroupColor(profile.group)} px-4 py-2 rounded-full shadow-lg`}>
                                                    <Crown className="h-4 w-4 text-white" />
                                                    <span className="text-white font-bold text-sm">{profile.group}</span>
                                                </div>
                                            </div>

                                            {/* Additional Info for Privileged Users */}
                                            {(profile.name && (isOwner || canSeeFullInfo)) && (
                                                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-300">
                                                    <User className="h-4 w-4 text-blue-400" />
                                                    <span>{profile.name}</span>
                                                </div>
                                            )}
                                            
                                            {(profile.email && (isOwner || canSeeFullInfo)) && (
                                                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-300">
                                                    <Mail className="h-4 w-4 text-green-400" />
                                                    <span>{profile.email}</span>
                                                </div>
                                            )}

                                            {profile.nationality && (
                                                <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-300">
                                                    <MapPin className="h-4 w-4 text-purple-400" />
                                                    <span>{profile.nationality}</span>
                                                </div>
                                            )}

                                            {/* Profile Actions */}
                                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                                {isOwner && (
                                                    <Link 
                                                        to="/profile/edit" 
                                                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        <span>Edit Profile</span>
                                                    </Link>
                                                )}
                                                
                                                <div className="flex items-center space-x-2 glass-morphism-dark px-4 py-3 rounded-xl border border-white/20">
                                                    {profile.is_profile_public ? (
                                                        <>
                                                            <Eye className="h-4 w-4 text-green-400" />
                                                            <span className="text-green-400 text-sm font-medium">Public Profile</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                                            <span className="text-gray-400 text-sm font-medium">Private Profile</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Ban Status Alert */}
                                {isTargetUserBanned && (
                                    <div className="p-6 border-b border-white/10">
                                        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 flex items-center space-x-4">
                                            <Ban className="h-8 w-8 text-red-400" />
                                            <div>
                                                <h3 className="text-red-400 font-bold text-lg">Account Restricted</h3>
                                                <p className="text-red-300">Reason: {profile.ban_reason}</p>
                                                <p className="text-red-300 text-sm">Until: {profile.banned_until ? new Date(profile.banned_until).toLocaleString() : 'Permanent'}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Profile Content */}
                                <div className="p-8">
                                    {profile.bio ? (
                                        <div className="mb-8">
                                            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                                                <MessageSquare className="h-5 w-5 text-blue-400" />
                                                <span>About</span>
                                            </h3>
                                            <div className="glass-morphism-dark rounded-xl p-6 border border-white/10">
                                                <p className="text-gray-200 leading-relaxed text-lg">{profile.bio}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-500/20 rounded-2xl mb-4">
                                                <MessageSquare className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Bio Available</h3>
                                            <p className="text-gray-500">This user hasn't shared their bio yet.</p>
                                        </div>
                                    )}

                                    {/* Profile Stats (Placeholder) */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                        <div className="glass-morphism-dark rounded-xl p-6 border border-white/10 text-center">
                                            <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                                            <div className="text-2xl font-bold text-white mb-1">12</div>
                                            <div className="text-gray-400 text-sm">Courses Completed</div>
                                        </div>
                                        
                                        <div className="glass-morphism-dark rounded-xl p-6 border border-white/10 text-center">
                                            <Award className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                                            <div className="text-2xl font-bold text-white mb-1">5</div>
                                            <div className="text-gray-400 text-sm">Certificates Earned</div>
                                        </div>
                                        
                                        <div className="glass-morphism-dark rounded-xl p-6 border border-white/10 text-center">
                                            <Activity className="h-8 w-8 text-green-400 mx-auto mb-3" />
                                            <div className="text-2xl font-bold text-white mb-1">89h</div>
                                            <div className="text-gray-400 text-sm">Learning Time</div>
                                        </div>
                                    </div>

                                    {/* Member Since */}
                                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                                        <div className="flex items-center justify-center space-x-2 text-gray-400">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm">Member since 2024</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-500/20 rounded-2xl mb-6">
                                    <User className="h-10 w-10 text-gray-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-4">Profile Not Found</h2>
                                <p className="text-gray-400 text-lg">The requested profile could not be found or is not accessible.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default PublicProfilePage;