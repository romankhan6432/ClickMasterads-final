export interface Achievement {
    _id: string;
    userId: string;
    name: string;
    description: string;
    completed: boolean;
    completedAt?: string;
    progress: number;
    maxProgress: number;
    type: 'ads_watched' | 'withdrawal_made' | 'daily_goal' | 'referral';
    createdAt: string;
}

export interface AchievementState {
    achievements: Achievement[];
    loading: boolean;
    error: string | null;
}
