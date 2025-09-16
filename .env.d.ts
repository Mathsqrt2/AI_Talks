declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: `production` | `development` | undefined;
    API_PORT: number;
    OLLAMA_HOST: string;

    TOKEN1: string;
    TOKEN2: string;

    TELEGRAM_INVITATION: string;
    PUBLIC_TELEGRAM_CHAT_ID: string;
    GROUP_CHAT_ID: string;

    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASS: string;
    DB_NAME: string;

    CORS_ORIGIN: string;

    MODEL: 'gemma3:1b' | 'gemma3:4b' | 'gemma3:12b' | 'gemma3:27b';
    LANGUAGE: 'PL' | 'EN';

    JWT_SECRET: string;
  }
}
