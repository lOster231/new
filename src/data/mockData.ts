// Mock data for the application
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'free' | 'premium';
  duration: string;
  students: number;
  rating: number;
  instructor: string;
  category: string;
  lessons: Lesson[];
  progress?: number;
  completed?: boolean;
  enrolledAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'game' | 'reading' | 'coding';
  duration: string;
  completed: boolean;
  content?: any;
}

export interface UserGoal {
  id: string;
  title: string;
  description: string;
  category: 'learning' | 'career' | 'project' | 'skill';
  startDate: string;
  endDate: string;
  completed: boolean;
  isPublic: boolean;
  steps: GoalStep[];
  progress: number;
}

export interface GoalStep {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface Friend {
  id: string;
  username: string;
  name: string;
  profilePicture: string | null;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  rank: UserRank;
  group: UserGroup;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: {
    username: string;
    name: string;
    profilePicture: string | null;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export type UserGroup = 'Owner' | 'Admin' | 'Senior Support' | 'Support' | 'Junior Support' | 'Premium Plan' | 'Basic Plan';
export type UserRank = 'Beginner' | 'Novice' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master' | 'Legend';

export interface MockUser {
  id: string;
  username: string;
  name: string;
  email: string;
  bio: string | null;
  nationality: string | null;
  profilePicture: string | null;
  isProfilePublic: boolean;
  group: UserGroup;
  rank: UserRank;
  displayRank: UserRank;
  bannedUntil: string | null;
  banReason: string | null;
  emailVerified: boolean;
  joinedAt: string;
  goals: UserGoal[];
  friends: string[];
  friendRequests: FriendRequest[];
  enrolledCourses: string[];
  completedCourses: string[];
  achievements: Achievement[];
  stats: UserStats;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'learning' | 'social' | 'achievement' | 'milestone';
}

export interface UserStats {
  totalLearningHours: number;
  coursesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalQuizzesPassed: number;
  averageScore: number;
}

// Mock courses data
export const mockCourses: Course[] = [
  {
    id: 'cpp-fundamentals',
    title: 'C++ Fundamentals',
    description: 'Learn the basics of C++ programming from scratch with hands-on exercises.',
    image: 'https://images.pexels.com/photos/7130549/pexels-photo-7130549.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Beginner',
    type: 'free',
    duration: '4 weeks',
    students: 5200,
    rating: 4.6,
    instructor: 'John Smith',
    category: 'Programming',
    lessons: [
      { id: '1', title: 'Introduction to C++', type: 'video', duration: '15 min', completed: false },
      { id: '2', title: 'Variables and Data Types', type: 'video', duration: '20 min', completed: false },
      { id: '3', title: 'Basic Syntax Quiz', type: 'quiz', duration: '10 min', completed: false },
      { id: '4', title: 'Control Structures', type: 'video', duration: '25 min', completed: false },
      { id: '5', title: 'Functions Game', type: 'game', duration: '15 min', completed: false },
    ]
  },
  {
    id: 'advanced-cpp',
    title: 'Advanced C++ Programming',
    description: 'Master modern C++ with advanced concepts, design patterns, and real-world projects.',
    image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Advanced',
    type: 'premium',
    duration: '8 weeks',
    students: 1250,
    rating: 4.9,
    instructor: 'Sarah Chen',
    category: 'Programming',
    lessons: [
      { id: '1', title: 'Modern C++ Features', type: 'video', duration: '30 min', completed: false },
      { id: '2', title: 'Smart Pointers Deep Dive', type: 'video', duration: '35 min', completed: false },
      { id: '3', title: 'Memory Management Quiz', type: 'quiz', duration: '15 min', completed: false },
      { id: '4', title: 'Template Metaprogramming', type: 'video', duration: '40 min', completed: false },
      { id: '5', title: 'Design Patterns Game', type: 'game', duration: '20 min', completed: false },
    ]
  },
  {
    id: 'data-structures',
    title: 'Data Structures & Algorithms',
    description: 'Implement efficient algorithms and data structures in C++ with practical examples.',
    image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Intermediate',
    type: 'premium',
    duration: '6 weeks',
    students: 890,
    rating: 4.8,
    instructor: 'Dr. Michael Rodriguez',
    category: 'Computer Science',
    lessons: [
      { id: '1', title: 'Arrays and Vectors', type: 'video', duration: '25 min', completed: false },
      { id: '2', title: 'Linked Lists Implementation', type: 'coding', duration: '30 min', completed: false },
      { id: '3', title: 'Stack and Queue Quiz', type: 'quiz', duration: '12 min', completed: false },
      { id: '4', title: 'Binary Trees', type: 'video', duration: '35 min', completed: false },
      { id: '5', title: 'Sorting Algorithm Game', type: 'game', duration: '18 min', completed: false },
    ]
  },
  {
    id: 'cpp-game-dev',
    title: 'Game Development with C++',
    description: 'Create games using C++ and popular game engines with hands-on projects.',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Intermediate',
    type: 'premium',
    duration: '10 weeks',
    students: 650,
    rating: 4.7,
    instructor: 'Alex Thompson',
    category: 'Game Development',
    lessons: [
      { id: '1', title: 'Game Engine Basics', type: 'video', duration: '28 min', completed: false },
      { id: '2', title: 'Graphics Programming', type: 'video', duration: '32 min', completed: false },
      { id: '3', title: 'Physics Quiz', type: 'quiz', duration: '15 min', completed: false },
      { id: '4', title: 'Audio Systems', type: 'video', duration: '22 min', completed: false },
      { id: '5', title: 'Game Logic Challenge', type: 'game', duration: '25 min', completed: false },
    ]
  },
  {
    id: 'cpp-web-backend',
    title: 'Web Backend with C++',
    description: 'Build high-performance web backends using modern C++ frameworks.',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Advanced',
    type: 'premium',
    duration: '7 weeks',
    students: 420,
    rating: 4.5,
    instructor: 'Emma Wilson',
    category: 'Web Development',
    lessons: [
      { id: '1', title: 'HTTP Servers in C++', type: 'video', duration: '30 min', completed: false },
      { id: '2', title: 'RESTful APIs', type: 'video', duration: '35 min', completed: false },
      { id: '3', title: 'Database Integration', type: 'coding', duration: '40 min', completed: false },
      { id: '4', title: 'Security Quiz', type: 'quiz', duration: '18 min', completed: false },
      { id: '5', title: 'Performance Optimization', type: 'video', duration: '28 min', completed: false },
    ]
  },
  {
    id: 'cpp-embedded',
    title: 'Embedded Systems with C++',
    description: 'Program microcontrollers and embedded devices using C++.',
    image: 'https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg?auto=compress&cs=tinysrgb&w=800',
    level: 'Advanced',
    type: 'premium',
    duration: '9 weeks',
    students: 380,
    rating: 4.6,
    instructor: 'David Kim',
    category: 'Embedded Systems',
    lessons: [
      { id: '1', title: 'Microcontroller Basics', type: 'video', duration: '25 min', completed: false },
      { id: '2', title: 'GPIO Programming', type: 'coding', duration: '30 min', completed: false },
      { id: '3', title: 'Interrupts and Timers', type: 'video', duration: '28 min', completed: false },
      { id: '4', title: 'Communication Protocols', type: 'quiz', duration: '15 min', completed: false },
      { id: '5', title: 'Real-time Systems', type: 'video', duration: '35 min', completed: false },
    ]
  }
];

// Mock users data
export const mockUsers: MockUser[] = [
  {
    id: '1',
    username: 'john_doe',
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Passionate C++ developer with 5 years of experience. Love working on game engines and system programming.',
    nationality: 'United States',
    profilePicture: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    isProfilePublic: true,
    group: 'Premium Plan',
    rank: 'Expert',
    displayRank: 'Expert',
    bannedUntil: null,
    banReason: null,
    emailVerified: true,
    joinedAt: '2024-01-15',
    goals: [
      {
        id: 'goal1',
        title: 'Master Advanced C++',
        description: 'Complete all advanced C++ courses and build a game engine',
        category: 'learning',
        startDate: '2024-01-01',
        endDate: '2024-06-01',
        completed: false,
        isPublic: true,
        progress: 65,
        steps: [
          { id: 'step1', title: 'Complete Advanced C++ Course', completed: true, completedAt: '2024-02-15' },
          { id: 'step2', title: 'Build a Simple Game Engine', completed: false },
          { id: 'step3', title: 'Optimize Performance', completed: false },
        ]
      }
    ],
    friends: ['2', '3'],
    friendRequests: [],
    enrolledCourses: ['cpp-fundamentals', 'advanced-cpp', 'data-structures'],
    completedCourses: ['cpp-fundamentals'],
    achievements: [
      {
        id: 'ach1',
        title: 'First Course Completed',
        description: 'Completed your first course',
        icon: '🎓',
        unlockedAt: '2024-02-01',
        category: 'learning'
      }
    ],
    stats: {
      totalLearningHours: 89,
      coursesCompleted: 3,
      currentStreak: 7,
      longestStreak: 15,
      totalQuizzesPassed: 25,
      averageScore: 87
    }
  },
  {
    id: '2',
    username: 'sarah_dev',
    name: 'Sarah Developer',
    email: 'sarah@example.com',
    bio: 'Software engineer specializing in backend development and system architecture.',
    nationality: 'Canada',
    profilePicture: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
    isProfilePublic: true,
    group: 'Admin',
    rank: 'Master',
    displayRank: 'Master',
    bannedUntil: null,
    banReason: null,
    emailVerified: true,
    joinedAt: '2023-11-20',
    goals: [],
    friends: ['1'],
    friendRequests: [],
    enrolledCourses: ['advanced-cpp', 'cpp-web-backend'],
    completedCourses: ['cpp-fundamentals', 'data-structures'],
    achievements: [],
    stats: {
      totalLearningHours: 156,
      coursesCompleted: 8,
      currentStreak: 12,
      longestStreak: 28,
      totalQuizzesPassed: 45,
      averageScore: 92
    }
  },
  {
    id: '3',
    username: 'mike_coder',
    name: 'Mike Coder',
    email: 'mike@example.com',
    bio: 'Embedded systems engineer with a passion for IoT and robotics.',
    nationality: 'Germany',
    profilePicture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    isProfilePublic: false,
    group: 'Basic Plan',
    rank: 'Intermediate',
    displayRank: 'Advanced',
    bannedUntil: null,
    banReason: null,
    emailVerified: true,
    joinedAt: '2024-03-10',
    goals: [],
    friends: ['1'],
    friendRequests: [],
    enrolledCourses: ['cpp-fundamentals', 'cpp-embedded'],
    completedCourses: [],
    achievements: [],
    stats: {
      totalLearningHours: 34,
      coursesCompleted: 1,
      currentStreak: 3,
      longestStreak: 8,
      totalQuizzesPassed: 12,
      averageScore: 78
    }
  }
];

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    receiverId: '2',
    message: 'Hey! How are you doing with the advanced C++ course?',
    timestamp: '2024-01-20T10:30:00Z',
    read: true
  },
  {
    id: '2',
    senderId: '2',
    receiverId: '1',
    message: 'Going great! The template metaprogramming section is really challenging but fun.',
    timestamp: '2024-01-20T10:35:00Z',
    read: true
  },
  {
    id: '3',
    senderId: '1',
    receiverId: '2',
    message: 'I know right! Want to work on the final project together?',
    timestamp: '2024-01-20T10:40:00Z',
    read: false
  }
];

// Available ranks and groups
export const availableRanks: UserRank[] = ['Beginner', 'Novice', 'Intermediate', 'Advanced', 'Expert', 'Master', 'Legend'];
export const availableGroups: UserGroup[] = ['Owner', 'Admin', 'Senior Support', 'Support', 'Junior Support', 'Premium Plan', 'Basic Plan'];

// Helper functions
export const getCurrentUser = (): MockUser => {
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    return JSON.parse(stored);
  }
  return mockUsers[0]; // Default to first user
};

export const setCurrentUser = (user: MockUser): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getUserById = (id: string): MockUser | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(course => course.id === id);
};

export const getAvailableCoursesForUser = (user: MockUser): Course[] => {
  const hasFullAccess = ['Owner', 'Admin', 'Senior Support', 'Support', 'Junior Support'].includes(user.group);
  const hasPremiumAccess = user.group === 'Premium Plan' || hasFullAccess;
  
  return mockCourses.filter(course => {
    if (course.type === 'free') return true;
    if (course.type === 'premium') return hasPremiumAccess;
    return false;
  });
};

export const getFriendsForUser = (userId: string): Friend[] => {
  const user = getUserById(userId);
  if (!user) return [];
  
  return user.friends.map(friendId => {
    const friend = getUserById(friendId);
    if (!friend) return null;
    
    return {
      id: friend.id,
      username: friend.username,
      name: friend.name,
      profilePicture: friend.profilePicture,
      status: Math.random() > 0.5 ? 'online' : 'offline',
      rank: friend.rank,
      group: friend.group
    };
  }).filter(Boolean) as Friend[];
};

export const getChatMessages = (userId1: string, userId2: string): ChatMessage[] => {
  return mockChatMessages.filter(msg => 
    (msg.senderId === userId1 && msg.receiverId === userId2) ||
    (msg.senderId === userId2 && msg.receiverId === userId1)
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};