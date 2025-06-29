declare module 'node-telegram-bot-api' {
    class TelegramBot {
        constructor(token: string, options?: { polling?: boolean, webHook?: boolean });
        sendMessage(chatId: number, text: string, options?: any): Promise<Message>;
        answerCallbackQuery(callbackQueryId: string, options?: any): Promise<boolean>;
        setWebHook(url: string, options?: WebhookOptions): Promise<boolean>;
        on(event: 'error' | 'polling_error', listener: (error: Error) => void): this;
        onText(regexp: RegExp, callback: (msg: Message, match: RegExpExecArray | null) => void): void;
    }

    interface User {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
    }

    interface Chat {
        id: number;
        type: string;
    }

    interface Message {
        message_id: number;
        from?: User;
        chat: Chat;
        date: number;
        text?: string;
    }

    interface CallbackQuery {
        id: string;
        from: User;
        message?: Message;
        data?: string;
    }

    interface Update {
        update_id: number;
        message?: Message;
        callback_query?: CallbackQuery;
    }

    interface WebhookOptions {
        secret_token?: string;
    }

    export default TelegramBot;
}
