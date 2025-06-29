import mongoose from 'mongoose';

declare global {
    var mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
    interface Window {
        show_9103912: any;
        Telegram: {
            WebApp: {
                initData: string;
                initDataUnsafe: {
                    user?: {
                        id: number;
                        username?: string;
                        first_name?: string;
                        last_name?: string;
                    };
                    start_param : string
                };
            };
        };
    }
}