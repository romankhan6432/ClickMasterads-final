export interface TopEarner {
    id: string;
    name: string;
    avatar?: string;
    totalEarnings: number;
    adsWatched: number;
    rank: number;
    country?: string;
    lastActive: string;
    isCurrentUser?: boolean;
}

export interface TopEarnersState {
    today: TopEarner[];
    allTime: TopEarner[];
    loading: boolean;
    error: string | null;
}
