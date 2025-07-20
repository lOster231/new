import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MockUser, getCurrentUser, setCurrentUser, mockUsers, UserGroup, UserRank } from '../data/mockData';

interface AuthContextType {
  user: MockUser | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; username: string; email: string; password: string; password_confirmation: string }) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isVerifying: boolean;
  showVerificationPopup: boolean;
  setShowVerificationPopup: React.Dispatch<React.SetStateAction<boolean>>;
  resendVerificationEmail: () => Promise<void>;
  updateUser: (newUserData: Partial<MockUser>) => void;
  hasPrivilege: (requiredGroups: string | string[]) => boolean;
  isBanned: () => boolean;
}

const GROUP_HIERARCHY: { [key: string]: number } = {
    'Basic Plan': 0,
    'Premium Plan': 1,
    'Junior Support': 2,
    'Support': 3,
    'Senior Support': 4,
    'Admin': 5,
    'Owner': 6,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<MockUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [showVerificationPopup, setShowVerificationPopup] = useState(false);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const currentUser = getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    if (!currentUser.emailVerified) {
                        setShowVerificationPopup(true);
                    }
                }
            } catch (error) {
                console.error('Auth verification failed', error);
            }
            setIsVerifying(false);
        };
        verifyAuth();
    }, []);

    const login = async (credentials: { email: string; password: string }) => {
        setIsLoading(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Find user by email (mock authentication)
            const foundUser = mockUsers.find(u => u.email === credentials.email);
            if (!foundUser) {
                throw new Error('Invalid credentials');
            }
            
            setUser(foundUser);
            setCurrentUser(foundUser);

            if (!foundUser.emailVerified) {
                setShowVerificationPopup(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: { name: string; username: string; email: string; password: string; password_confirmation: string }) => {
        setIsLoading(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Check if user already exists
            const existingUser = mockUsers.find(u => u.email === data.email || u.username === data.username);
            if (existingUser) {
                throw new Error('User already exists');
            }
            
            // Create new user (in real app, this would be handled by backend)
            const newUser: MockUser = {
                id: String(Date.now()),
                username: data.username,
                name: data.name,
                email: data.email,
                bio: null,
                nationality: null,
                profilePicture: null,
                isProfilePublic: false,
                group: 'Basic Plan',
                rank: 'Beginner',
                displayRank: 'Beginner',
                bannedUntil: null,
                banReason: null,
                emailVerified: false,
                joinedAt: new Date().toISOString().split('T')[0],
                goals: [],
                friends: [],
                friendRequests: [],
                enrolledCourses: [],
                completedCourses: [],
                achievements: [],
                stats: {
                    totalLearningHours: 0,
                    coursesCompleted: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    totalQuizzesPassed: 0,
                    averageScore: 0
                }
            };
            
            mockUsers.push(newUser);
            // Don't auto-login after registration, user needs to verify email
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setShowVerificationPopup(false);
        localStorage.removeItem('currentUser');
    };

    const resendVerificationEmail = async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
    };

    const updateUser = (newUserData: Partial<MockUser>) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            const updatedUser = { ...prevUser, ...newUserData };
            setCurrentUser(updatedUser);
            
            // Update in mock users array
            const userIndex = mockUsers.findIndex(u => u.id === prevUser.id);
            if (userIndex !== -1) {
                mockUsers[userIndex] = updatedUser;
            }
            
            return updatedUser;
        });
    };

    const isBanned = (): boolean => {
        if (!user || !user.bannedUntil) {
            return false;
        }
        const bannedUntilDate = new Date(user.bannedUntil);
        return bannedUntilDate > new Date();
    };

    const hasPrivilege = (requiredGroups: string | string[]): boolean => {
        if (!user) return false;

        const userPrivilege = GROUP_HIERARCHY[user.group] ?? -1;

        if (Array.isArray(requiredGroups)) {
            for (const group of requiredGroups) {
                const requiredPrivilege = GROUP_HIERARCHY[group] ?? -1;
                if (userPrivilege >= requiredPrivilege) {
                    return true;
                }
            }
            return false;
        }

        const requiredPrivilege = GROUP_HIERARCHY[requiredGroups] ?? -1;
        return userPrivilege >= requiredPrivilege;
    };

    const value = {
        user,
        login,
        register,
        logout,
        isLoading,
        isVerifying,
        showVerificationPopup,
        setShowVerificationPopup,
        resendVerificationEmail,
        updateUser,
        isBanned,
        hasPrivilege,
    };

    return (
        <AuthContext.Provider value={value}>
            {!isVerifying && children}
        </AuthContext.Provider>
    );
};