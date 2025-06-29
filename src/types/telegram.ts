export interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
        };
        start_param?: string;
        auth_date?: number;
        hash?: string;
    };
    platform?: string;
    colorScheme?: string;
    themeParams?: {
        bg_color?: string;
        text_color?: string;
        hint_color?: string;
        link_color?: string;
        button_color?: string;
        button_text_color?: string;
    };
}

export interface TelegramWindow {
    WebApp?: TelegramWebApp;
}

 